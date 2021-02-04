export class ExecutionContext {
  state: Record<string, any>;
  currentNodePath: Array<string>;
  finished: boolean = false;
  // If we are pausing the stream and therefore need to bail from the execution tree
  bail: boolean = false;

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
