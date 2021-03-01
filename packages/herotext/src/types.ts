import { ExecutionContext } from "./ExecutionContext";

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

export type FunctionASTParameter = {
  name: string;
  defaultValue: ContentItemAST;
};

export type FunctionAST = Omit<LabelAST, "type"> & {
  type: "function";
  parameters: FunctionASTParameter[];
};

export type FunctionInvocationAST = Omit<ContentSubstitutionAST, "type"> & {
  type: "invoke";
  parameters: ContentAST[];
};

export type ExternalAST = ContentItemAST & {
  type: "external";
  callback: (
    state: Record<string, string>,
    context: ExecutionContext,
    strand: ExecutionStrand
  ) => NodeExecutionResult | string;
};

export type InputAST = ContentItemAST & {
  type: "input";
  handler: string;
};

export type MainAST = {
  type: "main";
  content: ContentAST | null;
  labels: Record<string, LabelAST>;
};

export type SignatureParameterAST = {
  type: "parameter";
  name: string;
  defaultValue?: any;
};

export type LabelAST = Omit<ContentItemAST, "type"> & {
  type: "label";
  name: string;
  external: boolean;
  mode: "label" | "set" | "all";
  merge: boolean;
  content: ContentAST | null;
  signature: SignatureParameterAST[];
};

export type ReturnCommand = {
  type: "input";
  yieldValue?: any;
  strand: ExecutionStrand;
  handler: string;
};

export type StateElement = string | number | boolean | StateElement[];

export type StrandPathSegment = string | number;

export type ExecutionStrand = {
  path: StrandPathSegment;
  children: ExecutionStrand[];
  localScope: Record<string, StateElement>;
  internalState?: any;
};

export type ExecutionResultItem = string | ReturnCommand;

export type ExecutionResult = [NodeExecutionResult, ExecutionContext];

export type NodeExecutionResult = ExecutionResultItem[];
