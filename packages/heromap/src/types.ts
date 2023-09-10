export type MapNode<E = any> = {
    type: "Heromap::MapNode"
    lines: String[]
    legend: OperationNode[]
    externals: Record<string, E>
}

export type OperationNode = BrushOpNode | OrOpsNode | AndOpsNode
/* | InvocationNode */

// export type ExternalNode = {
//   type: "Heromap::ExternalNode";
//   id: string;
//   value: any;
// };

export type OrOpsNode = {
    type: "Heromap::OrOpsNode"
    ops: OperationNode[]
}

export type AndOpsNode = {
    type: "Heromap::AndOpsNode"
    quanitifier: QuantifierNode
    ops: OperationNode[]
}

export type BrushOpNode = {
    type: "Heromap::BrushOpNode"
    op: "apply" | "remove"
    target: GlyphNode | GlyphsNode | WordNode
    brush: BrushNode
}

export type BrushNodes = GlyphNode | GlyphsNode | WordNode | AndBrushesNode | OrBrushesNode

export type BrushNode = {
    type: "Heromap::BrushNode"
    brush: BrushNodes
    /* | InvocationNode */
    quantifier?: QuantifierNode
}

type QuantifierNode = NumberNode | FractionNode

export type GlyphNode = {
    type: "Heromap::GlyphNode"
    glyph: string
}

export type GlyphsNode = {
    type: "Heromap::GlyphsNode"
    glyphs: string[]
}

export type WordNode = {
    type: "Heromap::WordNode"
    path: string[]
}

export type AndBrushesNode = {
    type: "Heromap::AndBrushesNode"
    brushes: BrushNode[]
}

export type OrBrushesNode = {
    type: "Heromap::OrBrushesNode"
    brushes: BrushNode[]
}

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

export type ValueNode = StringNode | NumberNode | FractionNode

export type StringNode = {
    type: "Heromap::StringValue"
    value: string
}

export type NumberNode = {
    type: "Heromap::IntegerValue" | "Heromap::DecimalValue" | "Heromap::PercentageValue"
    value: number
}

export type FractionNode = {
    type: "Heromap::FractionValue"
    numerator: number
    denominator: number
}
