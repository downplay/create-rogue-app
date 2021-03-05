@{%

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

// TODO: With overlays, make sure trim keeps them all relative
const trimMapLines = (lines) => {
    const min = Math.min(...lines.map(line => line.lastIndexOf(" ")));
    if (min === -1) {
        return lines;
    }
    return lines.map(line => line.slice(min + 1));
}

const mapNode = ({ lines, legend }) => ({
    type: "Heromap::MapNode",
    lines: trimMapLines(lines),
    legend,
    externals: []
})

const brushOpNode = ({ target, brush, op = "apply" }) => ({
    type: "Heromap::BrushOpNode",
    target,
    brush,
    op
})

const operationGroupNode = (operations, quantifier) => ({
    type: "Heromap::AndOpsNode",
    operations,
    quantifier
})

const operationSwitchNode = (switches) => ({
    type: "Heromap::OrOpsNode",
    switches
})

const brushNode = (node, quantifier) => ({
    type: "Heromap::BrushNode",
    brush: node,
    quantifier
})

const andBrushesNode = (brushes) => ({
    type: "Heromap::AndBrushesNode",
    brushes
})

const orBrushesNode = (brushes) => ({
    type: "Heromap::OrBrushesNode",
    brushes
});

const integerValue = value => ({ type: "Heromap::IntegerValue", value });

const fractionValue = value => {
    const parts = value.split("/");
    const denominator = Number(parts[1]);
    if (denominator <= 0) {
        throw new Error("Denominator must be greater than 0");
    }
    return ({ type: "Heromap::FractionValue", numerator: Number(parts[0]), denominator });
}

const decimalValue = value => ({ type: "Heromap::DecimalValue", value });
const percentageValue = value =>  ({ type: "Heromap::PercentageValue", value });

const glyphNode = glyph =>  ({ type: "Heromap::GlyphNode", glyph });
const glyphsNode = glyphs =>  ({ type: "Heromap::GlyphsNode", glyphs: glyphs.split("") });
const wordNode = word =>  ({ type: "Heromap::WordNode", path: [ word ] });

%}

@lexer lexer

main        -> _ lines legend _                           {% d => mapNode({ lines: d[1], legend: d[2] }) %}

lines       -> %mapstart mapline:+                        {% ([_, mapline]) => mapline %}

mapline     -> %glyphs %mapend:? %newline                 {% d => d[0].value.trimEnd() %}

legend      -> op:+                                       {% id %}

op          -> applyOp                                    {% id %}
             | groupOps                                   {% d => operationSwitchNode(d[0]) %}

applyOp     -> __ stuff __ "=" __ brushes            
               {% d => brushOpNode({target: d[1], brush: brushNode(andBrushesNode(d[5])) }) %} 

groupOps    -> groupOp                                    {% d => [d[0]] %}
             | groupOps __ "|" groupOp                    {% d => [...d[0], d[3]] %}

# TODO: COULD make spaces inside the brackets optional here, with a special version of legend/op/applyOp
groupOp     -> __ "(" legend _ ")" quantifier:?           {% d => operationGroupNode(d[2], d[5]) %}

brushes     -> brush                                      {% d => [brushNode(d[0])] %}
             | brushes __ "+" __ brush                    {% d => [...d[0], brushNode(d[4])] %}

brush       -> switch                                     {% d => orBrushesNode(d[0]) %} 
             | group                                      {% id %}

switch      -> option                                     {% d => [d[0]] %}
             | switch __ "|" __ option                    {% d => [...d[0], d[4]] %}

option      -> (stuff | group) quantifier:?               {% d => brushNode(d[0][0], d[1]) %}

quantifier  -> ":" numeric                                {% d => d[1] %}

numeric     -> %number                                    {% d => integerValue(Number(d[0].value)) %}
             | %fraction                                  {% d => fractionValue(d[0].value) %} 
             | percentage                                 {% id %}

# TODO: decimals too
percentage  -> %number "%"                                {% d => percentageValue(Number(d[0])/100) %}

group       -> "(" _ brushes _ ")"                        {% d => andBrushesNode(d[2]) %}

stuff       -> glyphs                                     {% d => glyphsNode(d[0]) %}
             | %word                                      {% d => wordNode(d[0].value) %}
             | glyph                                      {% d => glyphNode(d[0]) %}

# Technically we could allow spaces in a glyph group; probably not wise tho

glyphs      -> "[" glyph:+ "]"                            {% d => d[1].join() %}

glyph       -> %glyph                                     {% vid %}
             | %escape                                    {% vid %}
             | "="                                        {% vid %}
             | "|"                                        {% vid %}
             | "+"                                        {% vid %}
             | "["                                        {% vid %}
             | "("                                        {% vid %}
             | ")"                                        {% vid %}
             | ":"                                        {% vid %}
             | "%"                                        {% vid %}                  
             | %number                                    
               {% (d, location, reject) => d[0].value.length === 1 ? d[0].value.length : reject %} 

_           -> whitespace:*                               {% empty %}

__          -> whitespace:+                               {% empty %}

___         -> whitespace:* %newline                      {% empty %}

whitespace  -> %space | %newline                          {% empty %} 