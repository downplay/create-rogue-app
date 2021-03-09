import { MainAST, ScopeValue, ExecutionContext } from "herotext";

// TODO: Maybe this is a herotext core thing, handled in execution, parent
// story running child story with its own scope. (And able to call into labels too with dot notation).

export type StoryInstance = {
  story: MainAST;
  globalScope: Record<string, ScopeValue>;
  mainThread: ExecutionContext;
};
