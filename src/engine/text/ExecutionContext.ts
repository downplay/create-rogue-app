export class ExecutionContext {
  state: Record<string, any>;
  currentNodePath: Array<string>;
  constructor(
    state: Record<string, any> = {},
    currentNodePath: Array<string> = []
  ) {
    this.state = state;
    this.currentNodePath = currentNodePath;
  }

  clone(): ExecutionContext {
    return new ExecutionContext(
      { ...this.state },
      this.currentNodePath.slice()
    );
  }
}
