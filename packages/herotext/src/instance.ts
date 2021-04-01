import { MainAST } from "./types";
import { ExecutionContext } from "./ExecutionContext";

export type StoryInstance<T extends {} = {}> = {
  story: MainAST;
  globalScope: T;
  mainThread?: ExecutionContext;
};

export const createInstance = <T extends {} = {}>(
  story: MainAST,
  globalScope?: T
): StoryInstance<T> => ({ story, globalScope: globalScope || ({} as T) });
