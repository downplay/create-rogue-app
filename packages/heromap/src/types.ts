export type MapNode = {
  type: "Heromap::MapNode";
  map: String[][];
  legend: OperationNode[];
  externals: Record<string, ExternalNode>[];
};

export type OperationNode = GlyphOperationNode | OperationGroupNode;

export type ExternalNode = {
  type: "Heromap::ExternalNode";
  id: string;
  value: any;
};

export type GlyphOperationNode = {
  type: "Heromap::GlyphOperationNode";
  glyph: string;
  operation: "apply" | "remove";
  brush: BrushNode;
};

export type BrushNode = {
  type: "Heromap::GlyphBrushNode";
  brushes: 
};

export type BrushSwitchNode = {
    type: "Heromap::GlyphBrushNode";
};

export type OperationGroupNode = MatchGroupNode;

export type MatchGroupNode = {
  type: "Heromap::MatchGroupNode";
  expression: MatchExpressionNode;
};

export type MatchExpressionNode = {
  left: ValueNode;
  right: ValueNode;
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
