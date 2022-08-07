import consola from "consola";
import { produce } from "immer";
import { isFunction } from "remeda";

import {
  ActionDefinition,
  fetchDurableObjectAction,
  IActionBody,
} from "./action";

// export type ReducerFunction<T> = (state: T, action: Action<T>) => T
// export const defineReducer = <T>(reducer: ReducerFunction<T>, defaultState) => {}

type DataRef<T = any> = {
  value: T;
};

type UpdateFunction<T> = (
  dataOrUpdater: T | ((value: T) => void)
) => Promise<T>;

type HooksStorage = {
  data: DataRef;
  initialize: () => any;
  rehydrate?: (dry: any) => any;
  update: UpdateFunction<any>;
};

type HooksAlarm = {
  handler: () => Promise<unknown>;
  set?: (msOrDate: number | Date) => Promise<number>;
  get?: () => Promise<number | null>;
};

type ActionContext = {
  request: Request;
  name: string;
};

type MiddlewareHandler = (
  payload: any,
  context: ActionContext
) => Promise<void>;

type HooksBaseContext = {
  type: string;
  actions: Record<string, (payload: any, context: ActionContext) => any>;
  middlewares: MiddlewareHandler[];
};

type HooksObjectContext = HooksBaseContext & {
  type: "object";
  storage: HooksStorage[];
  alarms: HooksAlarm[];
};

type HooksWorkerContext = HooksBaseContext & {
  type: "worker";
};

type HooksContext = HooksObjectContext | HooksWorkerContext;

let context: HooksContext | undefined;

const gatherHooks = (type: "object" | "worker", callback: () => void) => {
  if (context) {
    throw new Error(
      "Cannot define another hooks context from within your build function"
    );
  }
  context =
    type === "object"
      ? {
          type: "object",
          actions: {},
          middlewares: [],
          storage: [],
          alarms: [],
        }
      : {
          type: "worker",
          middlewares: [],
          actions: {},
        };
  callback();
  const lastContext = context;
  context = undefined;
  return lastContext;
};

export const useCurrentContext = () => {
  if (!context) {
    throw new Error(
      "Cannot use hooks outside of the durable object build function"
    );
  }
  return context;
};

const useDurableObjectContext = () => {
  const current = useCurrentContext();
  if (current.type !== "object") {
    throw new Error("Current hooks context is not an object context");
  }
  return current;
};

export const useAction = <P, O>(
  action: ActionDefinition<P, O>,
  handler: (payload: P, context: ActionContext) => Promise<O | Response>
) => {
  const context = useCurrentContext();
  context.actions[action.name] = handler;
};

export const useMiddleware = <T, C extends ActionContext = ActionContext>(
  handler: (payload: T, context: C) => Promise<void>
) => {
  const context = useCurrentContext();
  context.middlewares.push(handler as MiddlewareHandler);
};

export const useStorage = <T>(
  initialize: () => T,
  rehydrate?: (dry: T) => T
): [DataRef<T>, UpdateFunction<T>] => {
  const context = useDurableObjectContext();
  const data = {
    value: undefined,
  };
  const number = context.storage.length;
  // Initially the update function isn't present inside the HooksStorage object
  // but it'll get put there during the constructor of the DO class. The update we
  // return now will forward updates onto the real function, so action callbacks can use it.
  context.storage.push({ data, rehydrate, initialize } as HooksStorage);
  const update: UpdateFunction<T> = (updater) => {
    if (!context.storage[number].update) {
      throw new Error(
        "Update function cannot be used before the Durable Object class instance has been constructed."
      );
    }
    return context.storage[number].update(updater);
  };
  return [data as DataRef<T>, update];
};

export const useAlarm = (handler: () => Promise<unknown>) => {
  const context = useDurableObjectContext();
  const alarm: HooksAlarm = { handler };
  context.alarms.push(alarm);
  const set = async (msOrDate: number | Date) => {
    if (!alarm.set) {
      throw new Error(
        "Set function cannot be used before the Durable Object class instance has been constructed."
      );
    }
    await alarm.set(msOrDate);
  };

  const get = () => {
    if (!alarm.get) {
      throw new Error(
        "Get alarm function cannot be used before the Durable Object class instance has been constructed."
      );
    }
    return alarm.get();
  };

  return [set, get];
};

const handleFetch = async (request: Request, hooks: HooksContext) => {
  const message = (await request.json()) as IActionBody;
  if (!message || !message.action) {
    return new Response(
      JSON.stringify({
        error: "No action specified",
      })
    );
  }
  if (!hooks.actions[message.action]) {
    return new Response(
      JSON.stringify({
        error: "Unhandled action: " + message.action,
      })
    );
  }
  try {
    // TODO: Middlewares (specifically auth) may mutate the context but
    // also must be able to return errors and change the status. The typing of
    // the context should also be usable in actions. Is there also a need for
    // them to be able to trasnform the payload?
    const actionContext = { request, name: message.action };
    for (const m of hooks.middlewares) {
      await m(message.payload, actionContext);
    }
    const result = await hooks.actions[message.action](
      message.payload,
      actionContext
    );
    if (result instanceof Response) {
      return result;
    }
    return new Response(JSON.stringify({ result }));
  } catch (e) {
    consola.error(e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : e,
      }),
      { status: 500 }
    );
  }
};

export const defineDurableObject = <E>(build: (env: E) => void) => {
  class DefinedClass implements DurableObject {
    state: DurableObjectState;
    env: E;
    hooks: HooksObjectContext;

    constructor(state: DurableObjectState, env: E) {
      this.state = state;
      this.env = env;

      this.hooks = gatherHooks("object", () => {
        build(env);
      }) as HooksObjectContext;
      let currentAlarm: undefined | number | null;
      let currentAlarmPromise: Promise<number | null>;

      // Prepend an alarm handler to clear the next alarm var every time an alarm is triggered
      this.hooks.alarms.unshift({
        handler: async () => {
          currentAlarm = null;
        },
      });

      for (const alarm of this.hooks.alarms) {
        alarm.get = async () => {
          if (currentAlarmPromise) {
            await currentAlarmPromise;
          } else {
            currentAlarmPromise = this.state.storage.getAlarm();
            currentAlarm = await currentAlarmPromise;
          }
          return currentAlarm as number | null;
        };
        alarm.set = async (msOrDate: number | Date) => {
          // Set the alarm for next trigger (if no alarm exists or was in the past or new alarm is earlier)
          const current = await alarm.get!();
          const nextAlarm =
            msOrDate instanceof Date
              ? msOrDate.getTime()
              : Date.now() + msOrDate;
          if (!current || current > nextAlarm || current < Date.now()) {
            currentAlarm = nextAlarm;
            await this.state.storage.setAlarm(nextAlarm);
            return nextAlarm;
          }
          return current;
        };
      }

      this.state.blockConcurrencyWhile(async () => {
        await Promise.all(
          this.hooks.storage.map(async (s, i) => {
            const storageKey = "data-" + i;
            const stored = await this.state.storage.get(storageKey);
            if (stored) {
              s.data.value = s.rehydrate ? s.rehydrate(stored) : stored;
            } else {
              s.data.value = await s.initialize();
              // We don't need to await storage
              this.state.storage.put(storageKey, s.data.value);
            }
            s.update = async <T>(
              dataOrUpdater: T | ((current: T) => void)
            ): Promise<T> => {
              let data: T;
              if (isFunction(dataOrUpdater)) {
                data = produce(s.data.value as T, dataOrUpdater);
              } else {
                data = dataOrUpdater;
              }
              if (s.data.value === data) {
                return data;
              }
              s.data.value = data;
              await this.state.storage.put(storageKey, data);
              return data;
            };
          })
        );
      });
    }

    async fetch(request: Request): Promise<Response> {
      return handleFetch(request, this.hooks);
    }

    async alarm() {
      for (const alarm of this.hooks.alarms) {
        await alarm.handler();
      }
    }
  }
  return DefinedClass;
};

export const defineEntity = <P>(
  build: (props: P) => void
): EntityDefinition => {
  return {
    newInstance: (props: P) => {
      const hooks = gatherHooks("worker", () => {
        build(props);
      });
    },
    updateInstance: () => {},
    rehydrateInstance: () => {},
    // async fetch(request: Request, env: E): Promise<Response> {
    //   const hooks = gatherHooks("worker", () => {
    //     build(env);
    //   });
    //   return handleFetch(request, hooks);
    // },
  };
};

export const routeActionToObject = <T, O>(
  namespaceOrGetter:
    | DurableObjectNamespace
    | ((payload: T) => DurableObjectNamespace),
  action: ActionDefinition<T, O>
) => {
  useAction(action, async (payload) => {
    const namespace = isFunction(namespaceOrGetter)
      ? namespaceOrGetter(payload)
      : namespaceOrGetter;
    return fetchDurableObjectAction(namespace, action, payload);
  });
};
