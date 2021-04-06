import { ExecutionStrand, MainAST } from "./types";
import { createRng, RNG } from "./rng";

export type ExecutionContext<T extends {} = Record<string, any>> = {
  state: T;

  rng: RNG;

  // NOTE: Main only needed for access to labels. Maybe just fold labels into state? Would have same effect...
  main: MainAST;

  /**
   * Finished, success
   */
  finished: boolean;
  /**
   * Bailed from execution tree, suspending while await input
   */
  suspend: boolean;

  /**
   * Errored; error details will be in results array
   */
  error: boolean;

  /**
   * Root node of execution tree
   */
  root: ExecutionStrand;
};

type ConstructorProps<T extends {} = {}> = {
  state?: T;
  finished?: boolean;
  suspend?: boolean;
  error?: boolean;
  rng?: RNG;
};

export const createContext = <T extends {} = {}>(
  main: MainAST,
  root: ExecutionStrand,
  props: ConstructorProps<T> = {}
): ExecutionContext<T> => {
  const { state, finished, suspend, error, rng } = props;
  return {
    state: state || ({} as T),
    finished: typeof finished !== "undefined" ? finished : false,
    suspend: typeof suspend !== "undefined" ? suspend : false,
    error: typeof error !== "undefined" ? error : false,
    root,
    rng: rng || createRng(),
    main,
  };
};
