import { MainAST, render, createInstance, executeInstance } from "@hero/text";
import { HeroEngine, LABEL_TYPE, EngineState } from "./types";

export const entityManager = (
  engine: HeroEngine,
  entityTemplates: MainAST[]
) => {
  const entitiesMap = entityTemplates.reduce((acc, el) => {
    try {
      const type = render(el, engine.rng, {}, LABEL_TYPE);
      if (!type) {
        console.error(el);
        throw new Error("Blank type");
      }
      if (acc[type]) {
        console.error(el);
        throw new Error("Two entities with type " + type);
      }
      acc[type] = el;
    } catch (e) {
      console.error(el);
      throw e;
    }
    return acc;
  }, {} as Record<string, MainAST>);

  const create = <T = {}>(template: MainAST, state: T = {} as T) => {
    const instance = createInstance<EngineState & T>(template, {
      engine,
      ...state,
    });
    // TODO: don't use the global RNG; create a new one with a seed generated from
    // an RNG from a parent instance etc

    executeInstance(instance, engine.rng, "setup");
    return instance;
  };

  const manager = {
    templates: entitiesMap,
    create,
  };

  return manager;
};

export type EntityManager = ReturnType<typeof entityManager>;
