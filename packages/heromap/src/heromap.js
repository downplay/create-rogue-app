// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }


const moo = require("moo");
const newline = { match: /\n/, lineBreaks: true };
const space = { match: /[^\S\n]+/, lineBreaks: false };

const lexer = moo.states({
    // Consume all whitespace until we see first line that contains at least one non-whitespace char
    begin: {
        newline,
        mapstart: { match: /(?=[\s]*[^\s\n])/, next: "map" },
        space
    },
    map: {
        mapend: { match: /(?=\n\n)/, lineBreaks: true, next: "legend" },
        newline,
        glyphs: { match: /.+/ }
    },
    legend: {
        space,
        "=": "=",
        "[": { match: /\[(?=.)/, push: "glyphs" },
        "|": "|",
        "(": "(",
        ")": ")",
        "+": "+",
        ":": ":",
        "%": "%",
        fraction: { match: /[0-9]+\/[0-9]+/ },
        number: { match: /[0-9]+/ },
        word: { match: /[a-zA-Z][a-zA-Z0-9]+/ },
        glyph: { match: /\S/ },
        newline
    },
    glyphs: {
        escape: { match: "\]", value: x => x[1] },
        "]": { match: "]", pop: 1 },
        glyph: { match: /\S/ },
    }
})

const empty = () => null;

const vid = d => d[0].value;

const heromapSymbol = Symbol("heromap");

const mapNode = ({ map, legend }) => ({
    type: "Heromap::MapNode",
    map,
    legend
})

const brushOperationNode = ({ glyph, brushes }) => ({
    type: "Heromap::BrushOperationNode",
    glyph,
    brushes
})

const operationGroupNode = (operations, quanitifer) => ({
    type: "Heromap::GroupOperationNode",
    operations,
    quanitifer
})

const operationSwitchNode = (switches) => ({
    type: "Heromap::OperationSwitchNode",
    switches
})

const brushesNode = (brushes) => ({
    type: "Heromap::GroupBrushNode",
    brushes
})

const fractionValue = value => {
    const parts = value.split("/");
    return ({ type: "Heromap::FractionValue", numerator: Number(parts[0]), denominator: Number(parts[1]) });
}

const integerValue = value => {
    return ({ type: "Heromap::IntegerValue", value });
}

const percentageValue = value => {
    return ({ type: "Heromap::PercentageValue", value });
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "map", "legend", "_"], "postprocess": d => mapNode({ map: d[1], legend: d[2] })},
    {"name": "map$ebnf$1", "symbols": ["mapline"]},
    {"name": "map$ebnf$1", "symbols": ["map$ebnf$1", "mapline"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "map", "symbols": [(lexer.has("mapstart") ? {type: "mapstart"} : mapstart), "map$ebnf$1"], "postprocess": ([_, mapline]) => mapline},
    {"name": "mapline$ebnf$1", "symbols": [(lexer.has("mapend") ? {type: "mapend"} : mapend)], "postprocess": id},
    {"name": "mapline$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "mapline", "symbols": [(lexer.has("glyphs") ? {type: "glyphs"} : glyphs), "mapline$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": d => d[0].value.trimEnd()},
    {"name": "legend$ebnf$1", "symbols": ["op"]},
    {"name": "legend$ebnf$1", "symbols": ["legend$ebnf$1", "op"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "legend", "symbols": ["legend$ebnf$1"], "postprocess": id},
    {"name": "op", "symbols": ["applyOp"], "postprocess": id},
    {"name": "op", "symbols": ["groupOps"], "postprocess": d => operationSwitchNode(d[0])},
    {"name": "applyOp", "symbols": ["__", "stuff", "__", {"literal":"="}, "__", "brushes"], "postprocess": d => brushOperationNode({glyph: d[1], brushes: brushesNode(d[5]) })},
    {"name": "groupOps", "symbols": ["groupOp"], "postprocess": d => [d[0]]},
    {"name": "groupOps", "symbols": ["groupOps", "__", {"literal":"|"}, "groupOp"], "postprocess": d => [...d[0], d[2]]},
    {"name": "groupOp$ebnf$1", "symbols": ["quantifier"], "postprocess": id},
    {"name": "groupOp$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "groupOp", "symbols": ["__", {"literal":"("}, "legend", "_", {"literal":")"}, "groupOp$ebnf$1"], "postprocess": d => operationGroupNode(d[1], d[6])},
    {"name": "brushes", "symbols": ["brush"], "postprocess": d => [d[0]]},
    {"name": "brushes", "symbols": ["brushes", "__", {"literal":"+"}, "__", "brush"], "postprocess": d => [...d[0], d[4]]},
    {"name": "brush", "symbols": ["switch"], "postprocess": d => ({ switch: d[0] })},
    {"name": "brush", "symbols": ["group"], "postprocess": ([group]) => ({ group })},
    {"name": "switch", "symbols": ["option"], "postprocess": d => [d[0]]},
    {"name": "switch", "symbols": ["switch", "__", {"literal":"|"}, "__", "option"], "postprocess": d => [...d[0], d[4]]},
    {"name": "option$subexpression$1", "symbols": ["stuff"]},
    {"name": "option$subexpression$1", "symbols": ["group"]},
    {"name": "option$ebnf$1", "symbols": ["quantifier"], "postprocess": id},
    {"name": "option$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "option", "symbols": ["option$subexpression$1", "option$ebnf$1"], "postprocess": ([option, quantifier]) => ({ option, quantifier })},
    {"name": "quantifier", "symbols": [{"literal":":"}, "numeric"], "postprocess": d => d[1]},
    {"name": "numeric", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": d => integerValue(Number(d[0].value))},
    {"name": "numeric", "symbols": [(lexer.has("fraction") ? {type: "fraction"} : fraction)], "postprocess": d => fractionValue(d[0].value)},
    {"name": "numeric", "symbols": ["percentage"], "postprocess": id},
    {"name": "percentage", "symbols": [(lexer.has("number") ? {type: "number"} : number), {"literal":"%"}], "postprocess": d => percentageValue(Number(d[0]))},
    {"name": "group", "symbols": [{"literal":"("}, "_", "brushes", "_", {"literal":")"}], "postprocess": d => brushesNode(d[2])},
    {"name": "stuff", "symbols": ["glyphs"], "postprocess": d => ({ glyphs: d[0] })},
    {"name": "stuff", "symbols": [(lexer.has("word") ? {type: "word"} : word)], "postprocess": d => ({ word: d[0].value })},
    {"name": "stuff", "symbols": ["glyph"], "postprocess": d => ({ glyph: d[0] })},
    {"name": "glyphs$ebnf$1", "symbols": ["glyph"]},
    {"name": "glyphs$ebnf$1", "symbols": ["glyphs$ebnf$1", "glyph"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "glyphs", "symbols": [{"literal":"["}, "glyphs$ebnf$1", {"literal":"]"}], "postprocess": d => d[1].join()},
    {"name": "glyph", "symbols": [(lexer.has("glyph") ? {type: "glyph"} : glyph)], "postprocess": vid},
    {"name": "glyph", "symbols": [(lexer.has("escape") ? {type: "escape"} : escape)], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":"="}], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":"|"}], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":"+"}], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":"["}], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":"("}], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":")"}], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":":"}], "postprocess": vid},
    {"name": "glyph", "symbols": [{"literal":"%"}], "postprocess": vid},
    {"name": "glyph", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (d, location, reject) => d[0].value.length === 1 ? d[0].value.length : reject},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "whitespace"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": empty},
    {"name": "__$ebnf$1", "symbols": ["whitespace"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "whitespace"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": empty},
    {"name": "___$ebnf$1", "symbols": []},
    {"name": "___$ebnf$1", "symbols": ["___$ebnf$1", "whitespace"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "___", "symbols": ["___$ebnf$1", (lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": empty},
    {"name": "whitespace", "symbols": [(lexer.has("space") ? {type: "space"} : space)]},
    {"name": "whitespace", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)], "postprocess": empty}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
