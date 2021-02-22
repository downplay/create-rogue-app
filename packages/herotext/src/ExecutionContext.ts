export type ExecutionContextPath = {
  path: Array<string>;
  yieldValue?: any;
};

type ConstructorProps = {
  state?: Record<string, any>;
  finished?: boolean;
  bail?: boolean;
  error?: boolean;
  executions?: ExecutionContextPath[];
};

const defaultProps: ConstructorProps = {
  state: {},
  finished: false,
  bail: false,
  error: false,
  executions: [],
};

export class ExecutionContext {
  state: Record<string, any>;
  finished: boolean = false;
  // If we are pausing the stream and therefore need to bail from the execution tree
  bail: boolean = false;
  error: boolean = false;
  executions: ExecutionContextPath[] = [];

  constructor(props?: ConstructorProps) {
    const { state, finished, bail, error, executions } = {
      ...defaultProps,
      ...props,
    } as ExecutionContext;
    this.state = state;
    this.finished = finished;
    this.bail = bail;
    this.error = error;
    this.executions = executions;
  }

  clone(): ExecutionContext {
    return new ExecutionContext({
      state: { ...this.state },
      finished: this.finished,
      bail: this.bail,
      error: this.error,
      // TODO: This is not quite done
      executions: this.executions.slice(),
    });
  }
}
