export type MapNode = {
  type: "Heromap::MapNode";
  map: String[][];
  legend: OperationNode[];
  externals: Record<string, any>;
};

type OperationNode = BrushOpNode | OrOpsNode;
/* | InvocationNode */

// export type ExternalNode = {
//   type: "Heromap::ExternalNode";
//   id: string;
//   value: any;
// };

type OrOpsNode = {
  type: "Heromap::OrOpsNode";
  quanitifier: QuantifierNode;
  ops: OperationNode[];
};

type BrushOpNode = {
  type: "Heromap::BrushOpNode";
  op: "apply" | "remove";
  target: GlyphNode | GlyphsNode | WordNode;
  brush: BrushNode;
};

type BrushNode = {
  type: "Heromap::BrushNode";
  brush: GlyphNode | GlyphsNode | WordNode | AndBrushesNode | OrBrushesNode;
  /* | InvocationNode */
  quantifier?: QuantifierNode;
};

type QuantifierNode = NumberNode | FractionNode;

type GlyphNode = {
  type: "Heromap::GlyphNode";
  glyph: string;
};

type GlyphsNode = {
  type: "Heromap::GlyphsNode";
  glyphs: [];
};

type WordNode = {
  type: "Heromap::GlyphsNode";
  path: string[];
};

type AndBrushesNode = {
  type: "Heromap::OrBrushesNode";
  brushes: BrushNode[];
};

type OrBrushesNode = {
  type: "Heromap::AndBrushesNode";
  brushes: BrushNode[];
};

// type MatchExpressionNode = {
//   left: ValueNode;
//   right: ValueNode;
//   // TODO: Cna generate this list automatically from `operators` const?
//   operator:
//     | "eq"
//     | "eqeq"
//     | "gt"
//     | "gteq"
//     | "lt"
//     | "lteq"
//     | "match"
//     | "noteq"
//     | "notmatch";
// };

export type ValueNode = StringNode | NumberNode | FractionNode;

export type StringNode = {
  type: "Heromap::StringValue";
  value: string;
};

export type NumberNode = {
  type:
    | "Heromap::IntegerValue"
    | "Heromap::DecimalValue"
    | "Heromap::PercentageValue";
  value: number;
};

export type FractionNode = {
  type: "Heromap::FractionValue";
  numerator: number;
  denominator: number;
};
