import { ExecutionStrand, MainAST } from "./types";
import { createRng } from "./rng";
import { RNG } from "./rng";

type ConstructorProps = {
  state?: Record<string, any>;
  finished?: boolean;
  suspend?: boolean;
  error?: boolean;
  root?: ExecutionStrand;
  rng?: RNG;
  main: MainAST;
};

export class ExecutionContext {
  state: Record<string, any> = {};
  rng: RNG;

  // NOTE: Main only needed for access to labels. Maybe just fold labels into state? Would have same effect...
  main: MainAST;

  /**
   * Finished, success
   */
  finished: boolean = false;
  /**
   * Bailed from execution tree, suspending while await input
   */
  suspend: boolean = false;

  /**
   * Errored; error details will be in results array
   */
  error: boolean = false;

  /**
   * Root node of execution tree
   */
  root?: ExecutionStrand;

  constructor(props: ConstructorProps) {
    const { state, finished, suspend, error, root, rng, main } = props;
    this.state = state || this.state;
    this.finished = typeof finished !== "undefined" ? finished : this.finished;
    this.suspend = typeof suspend !== "undefined" ? suspend : this.suspend;
    this.error = typeof error !== "undefined" ? error : this.error;
    this.root = root;
    this.rng = rng || createRng();
    this.main = main;
  }

  clone(): ExecutionContext {
    return new ExecutionContext({
      state: { ...this.state },
      rng: this.rng,
      finished: this.finished,
      suspend: this.suspend,
      error: this.error,
      root: this.root, // TODO: This should be cloned too...
      main: this.main,
    });
  }
}
