import { ExecutionContext } from "./ExecutionContext";
import { Vector } from "./vector";
import { StoryInstance } from "./instance";

export interface ContentItemAST {
  type:
    | "text"
    | "substitution"
    | "invoke"
    | "main"
    | "label"
    | "assignment"
    | "function"
    | "choices"
    | "input"
    | "external";
}

export type ContentAST = ContentItemAST[] | ContentItemAST;

export type ContentTextAST = ContentItemAST & {
  type: "text";
  text: string;
};

export type ContentSubstitutionAST = ContentItemAST & {
  type: "substitution";
  path: (string | ContentAST)[];
};

export type ContentAssignmentAST = ContentItemAST & {
  type: "assignment";
  variable: string;
  content: ContentAST;
};

export type ValueAST = {
  type: "number" | "percent" | "compound" | "text";
  value: string | number | ContentAST;
};

export type PreconditionAST = {
  left: ValueAST;
  right: ValueAST;
  // TODO: Cna generate this list automatically from `operators` const?
  operator:
    | "eq"
    | "eqeq"
    | "gt"
    | "gteq"
    | "lt"
    | "lteq"
    | "match"
    | "noteq"
    | "notmatch";
};

export type ChoiceAST = {
  type: "choice";
  weight: number;
  content: ContentAST;
  preconditions: PreconditionAST[];
};

export type ContentChoiceAST = {
  type: "choices";
  content: ChoiceAST[];
};

export type FunctionAST = LabelAST & {
  signature: SignatureParameterAST[];
};

export type FunctionInvocationAST = Omit<ContentSubstitutionAST, "type"> & {
  type: "invoke";
  parameters: ContentAST[];
};

// TODO: Passing around stories by reference (e.g. for an instance spawner)
export type PrimitiveValue = {
  type:
    | "string"
    | "number"
    | "boolean"
    | "array"
    | /*| "story"*/ "instance"
    | "vector";
  value:
    | string
    | number
    | boolean
    | Vector
    | PrimitiveValue[]
    | Record<string, PrimitiveValue>
    // | MainAST
    | StoryInstance;
};

export type ComplexValue = {
  type: "complex";
  value: Record<string, ScopeValue>;
};

export type ScopeValue =
  | null
  | string
  | number
  | boolean
  | Vector
  | StoryInstance
  | ComplexValue
  | PrimitiveValue
  | ScopeValue[];
// | Record<string, ScopeValue>;

export type ExternalNodeCallback<S extends any = {}> = (
  state: S,
  context: ExecutionContext,
  strand: ExecutionStrand
) => NodeExecutionResult | string;

export type ExternalAST = ContentItemAST & {
  type: "external";
  callback: ExternalNodeCallback;
};

export type InputAST = ContentItemAST & {
  type: "input";
  handler: string;
};

export type MainAST<TState = {}> = {
  type: "main";
  content: ContentAST | null;
  labels: Record<string, LabelAST>;
};

export type SignatureParameterAST = {
  type: "parameter";
  name: string;
  defaultValue?: any;
  optional: boolean;
};

export type LabelAST = Omit<ContentItemAST, "type"> & {
  type: "label";
  name: string;
  external: boolean;
  mode: "label" | "set" | "all";
  merge: boolean;
  content: ContentAST | ScopeValue | null;
};

export type ReturnCommand = {
  type: "updateGlobal" | "updateLocal" | "input" | "trigger";
};

export type ReturnCommandUpdate<T extends {}> = Omit<ReturnCommand, "type"> & {
  type: "updateGlobal" | "updateLocal";
  values: T;
};

export type ReturnCommandInput = Omit<ReturnCommand, "type"> & {
  type: "input" | "trigger";
  yieldValue?: any;
  strand: ExecutionStrand;
  handler: string;
};

// TODO: There's a bunch of weird overlap, Scalar vs ExecutionResultItem, also with heromaps.
// Also will need vector etc.
export type ScalarValue = string | number | boolean | Vector;

export interface IStateElement {}

export type StateElement = (IStateElement | ScalarValue) | StateElement[];

export type StrandPathSegment = string | number;

export type ExecutionStrand = {
  path: StrandPathSegment;
  children: ExecutionStrand[];
  localScope: Record<string, StateElement>;
  internalState?: any;
};

export type TypedValue = PrimitiveValue | ComplexValue | ReturnCommand;

export type ExecutionResultItem =
  | null
  | string
  | number
  | boolean
  | Vector
  | TypedValue
  | StoryInstance;

export type ExecutionResult = [NodeExecutionResult, ExecutionContext];

export type NodeExecutionResult = ExecutionResultItem[];
