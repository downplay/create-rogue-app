import { MainAST, render, storyInstance } from "herotext";
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
    return storyInstance<EngineState & T>(template, { engine, ...state });
  };

  const manager = {
    templates: entitiesMap,
    create,
  };

  return manager;
};

export type EntityManager = ReturnType<typeof entityManager>;
