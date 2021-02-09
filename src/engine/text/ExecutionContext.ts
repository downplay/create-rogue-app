type ConstructorProps = {
  state?: Record<string, any>;
  currentNodePath?: Array<string>;
  finished?: boolean;
  bail?: boolean;
  error?: boolean;
};

const defaultProps: ConstructorProps = {
  state: {},
  currentNodePath: [],
  finished: false,
  bail: false,
  error: false,
};

export class ExecutionContext {
  state: Record<string, any>;
  currentNodePath: Array<string>;
  finished: boolean = false;
  // If we are pausing the stream and therefore need to bail from the execution tree
  bail: boolean = false;
  error: boolean = false;

  constructor(props?: ConstructorProps) {
    const { state, currentNodePath, finished, bail, error } = {
      ...defaultProps,
      ...props,
    } as ExecutionContext;
    this.state = state;
    this.currentNodePath = currentNodePath;
    this.finished = finished;
    this.bail = bail;
    this.error = error;
  }

  clone(): ExecutionContext {
    return new ExecutionContext({
      state: { ...this.state },
      currentNodePath: this.currentNodePath.slice(),
      finished: this.finished,
      bail: this.bail,
      error: this.error,
    });
  }
}
