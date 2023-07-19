// TODO: Have to convert this in a manual step (instead of the 'require' genereated)
// otherwise es modules are broken later on.
// Would be nice to automate transformation of this file, exercise for another day
// however.
// Also had to manually fix the export method.
// Probably the solution is to move the grammars into their own packages
// to avoid the mixture of js and ts really screwing with things.
import * as moo from "moo"

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
function id(x) {
    return x[0]
}

const assign = {
    match: /\$[a-zA-Z0-9]+=/,
    push: "nospace",
    value: (x) => x.slice(1, x.length - 1)
}
const bassign = {
    match: /\$\[[a-zA-Z0-9 ]+\]=/,
    push: "nospace",
    value: (x) => x.slice(2, x.length - 2)
}

const sub = { match: /\$[a-zA-Z0-9]+/, value: (x) => x.slice(1), push: "subpath" }
const bsub = { match: /\$\[/, push: "sublabel" }
const newline = { match: /(?:\r\n|\r|\n)/, lineBreaks: true }
const space = { match: /[ \t]+/, lineBreaks: false }
const input = "$?"

const escape = { match: /\\[\\\[\]\{\}\$|:\/]/, value: (x) => x[1] }
const lineComment = { match: /\/\/.*$/ }
const blockComment = { match: /\/\*/, push: "comment" }

const lexer = moo.states({
    line: {
        bang: /^!/,
        assign,
        bassign,
        sub,
        bsub,
        input,
        labeleqmerge: {
            match: /^[a-zA-Z0-9 ]+:=~/,
            value: (x) => x.slice(0, x.indexOf(":"))
        },
        labeleq: {
            match: /^[a-zA-Z0-9 ]+:=/,
            value: (x) => x.slice(0, x.indexOf(":"))
        },
        labelplusmerge: {
            match: /^[a-zA-Z0-9 ]+:\+~/,
            value: (x) => x.slice(0, x.indexOf(":")),
            push: "labelend"
        },
        labelplus: {
            match: /^[a-zA-Z0-9 ]+:\+/,
            value: (x) => x.slice(0, x.indexOf(":")),
            push: "labelend"
        },
        labelmerge: {
            match: /^[a-zA-Z0-9 ]+:~/,
            value: (x) => x.slice(0, x.indexOf(":")),
            push: "labelend"
        },
        label: {
            match: /^[a-zA-Z0-9 ]+:/,
            value: (x) => x.slice(0, x.indexOf(":")),
            push: "labelend"
        },
        "{": { match: "{", push: "precondition" },
        "[": { match: "[", push: "group" },
        "]": { match: "]", pop: 1 },
        "|": "|",
        lineComment,
        blockComment,
        newline,
        space,
        escape,
        string: moo.fallback
    },
    group: {
        assign,
        bassign,
        sub,
        bsub,
        input,
        "{": { match: "{", push: "precondition" },
        "[": { match: "[", push: "group" },
        "]": { match: "]", pop: 1 },
        "|": "|",
        lineComment,
        blockComment,
        space,
        escape,
        string: moo.fallback
    },
    nospace: {
        assign,
        bassign,
        sub,
        bsub,
        input,
        escape,
        // TODO: nospace is kinda broken anyway, would be nice to switch to moo.fallback, but the precondition
        // catch-all does it instead; would need a weird group of most non-alphanumeric chars instead
        string: {
            match: /(?:\$\$|\\[\\\[\]\$\{\}|]|\\u[a-fA-F0-9]{4}|[^\\\{\}\$\s|\[\]])+/,
            lineBreaks: false
        },
        "{": { match: "{", push: "precondition" },
        "[": { match: "[", push: "group" },
        "|": "|",
        nospaceend: { match: /(?=[^])/, lineBreaks: true, pop: 1 }
    },
    labelend: {
        newline: { ...newline, pop: 1 },
        space,
        "(": { match: "(", push: "labelparams" }
    },
    labelparams: {
        // TODO: support spaces in var names
        varname: { match: /\$[a-zA-Z0-9]+/, value: (x) => x.slice(1) },
        "?": "?",
        ",": ",",
        ")": { match: ")", pop: 1 },
        space,
        newline,
        lineComment,
        blockComment
    },
    subpath: {
        path: { match: /\.[a-zA-Z0-9]+/, value: (x) => x.slice(1) },
        bpath: { match: /\.\[/, next: "sublabel" },
        "(": { match: "(", next: "funcparams" },
        pathend: { match: /(?=[^])/, pop: 1, lineBreaks: true }
    },
    sublabel: {
        string: { match: /[a-zA-Z0-9 ]+/ },
        assign,
        bassign,
        sub,
        bsub,
        input,
        "[": { match: "[", push: "group" },
        "]": { match: "]", next: "subpath" },
        "|": "|"
    },
    // TODO: Comments inside funcparams should be able to work
    funcparams: {
        //assign,
        //bassign,
        sub,
        bsub,
        input,
        ",": ",",
        "{": { match: "{", push: "precondition" },
        "[": { match: "[", push: "group" },
        ")": { match: ")", pop: 1 },
        "|": "|",
        lineComment,
        blockComment,
        string: moo.fallback
    },
    precondition: {
        number: /-?[0-9]+(?:\.[0-9]+)?\%?/,
        compare: /(?:[<>=!]=?|~=?)/,
        sub,
        bsub,
        "[": { match: "[", push: "group" },
        "}": { match: "}", pop: 1 },
        ",": ",",
        "%": "%",
        "|": "|",
        space,
        escape,
        string: moo.fallback
    },
    comment: {
        endComment: { match: "*/", pop: 1 },
        string: moo.fallback
    }
})

const empty = () => null

const textContent = (text) => ({ type: "text", text })

const subContent = (label) => {
    // Simplify if there is just a single text element anyway
    if (typeof label !== "string") {
        if (label.type === "text") {
            label = label.text
        }
    }
    return { type: "substitution", path: label }
}

const functionCallContent = (label, parameters) => {
    if (typeof label !== "string") {
        if (label.type === "text") {
            label = label.text
        }
    }
    return { type: "invoke", path: label, parameters }
}

const assignContent = (variable, content) => {
    return { type: "assignment", content: choices(content), variable }
}

const choices = (items) => {
    if (items) {
        items = items.filter((item) => item !== null)
    }
    if (items === null || items.length === 0) {
        return null
    }
    if (items.length === 1 && items[0].preconditions && items[0].preconditions.length === 0) {
        return items[0].content
    }
    return { type: "choices", content: items }
}

const labelsObject = (labelsArray) =>
    labelsArray.reduce((acc, el) => {
        if (acc[el.name]) {
            throw new Error("Duplicate label: " + el.name)
        }
        acc[el.name] = el
        return acc
    }, {})

const main = (content, labels) => ({
    type: "main",
    content: choices(content),
    labels: labelsObject(labels)
})

const choice = (content, preconditions) => {
    const result = { type: "choice", content, weight: 1, preconditions: [] }
    if (preconditions) {
        preconditions.forEach((cond) => {
            if (/*cond.type === "number" || */ cond.type === "percent") {
                result.weight = cond.value
            } else {
                result.preconditions.push(cond)
            }
        })
    }
    return result
}

const operators = {
    "==": "eqeq",
    "=": "eq",
    ">": "gt",
    ">=": "gteq",
    "<": "lt",
    "<=": "lteq",
    "~": "match",
    "!=": "noteq",
    "!~": "notmatch"
}

const preComparison = (left = { type: "parameter" }, operator, right) => ({
    left,
    operator: operators[operator],
    right
})

const soloValueComparison = (value) => {
    return /*value.type === "number" ||*/ value.type === "percent"
        ? value
        : preComparison(null, "=", value)
}

const numberValue = (value) => {
    let toParse = value
    if (value[value.length - 1] === "%") {
        toParse = value.slice(0, value.length - 1)
        return {
            type: "percent",
            value: Number(toParse) / 100
        }
    }
    return {
        type: "number",
        value: Number(toParse)
    }
}

const compoundValue = (value) => ({ type: "compound", value })

const label = (name, items, mode, merge = false, signature = []) => ({
    type: "label",
    name,
    content: choices(items),
    mode,
    merge,
    signature
})

const signatureParam = (name, optional, defaultValue) => ({
    type: "param",
    name,
    optional,
    defaultValue
})

const inputContent = (value) => ({ type: "input" })

const mergeParts = (parts) => {
    const merged = []
    let last = undefined
    for (const part of parts) {
        if (part === null || typeof part === "undefined") {
            continue
        }
        if (last && last.type === "text" && part.type === "text") {
            last.text = last.text + part.text
        } else {
            if (part && part.type === "text") {
                last = { ...part }
            } else {
                last = part
            }
            merged.push(last)
        }
    }
    return merged
}

const flatParts = (a) => {
    if (typeof a === "string") {
        throw new Error("String: " + a)
    }
    const merged = mergeParts(a)
    return merged.length <= 1 ? merged[0] || null : merged
}

var grammar = {
    Lexer: lexer,
    ParserRules: [
        { name: "main", symbols: ["_", "content", "_"], postprocess: (d) => main(d[1], []) },
        {
            name: "main",
            symbols: ["_", "content", "_", "labels"],
            postprocess: (d) => main(d[1], d[3])
        },
        { name: "main", symbols: ["_", "labels"], postprocess: (d) => main([], d[1]) },
        { name: "labels$ebnf$1", symbols: ["labelledContent"] },
        {
            name: "labels$ebnf$1",
            symbols: ["labels$ebnf$1", "labelledContent"],
            postprocess: function arrpush(d) {
                return d[0].concat([d[1]])
            }
        },
        { name: "labels", symbols: ["labels$ebnf$1"], postprocess: id },
        {
            name: "labelledContent",
            symbols: ["label", "_", "content", "_"],
            postprocess: (d) => label(d[0][0], d[2], d[0][1], d[0][2], d[0][3])
        },
        {
            name: "label$ebnf$1",
            symbols: [lexer.has("space") ? { type: "space" } : space],
            postprocess: id
        },
        {
            name: "label$ebnf$1",
            symbols: [],
            postprocess: function (d) {
                return null
            }
        },
        {
            name: "label",
            symbols: [
                "labelType",
                "label$ebnf$1",
                lexer.has("newline") ? { type: "newline" } : newline
            ],
            postprocess: id
        },
        {
            name: "label$ebnf$2",
            symbols: [lexer.has("space") ? { type: "space" } : space],
            postprocess: id
        },
        {
            name: "label$ebnf$2",
            symbols: [],
            postprocess: function (d) {
                return null
            }
        },
        {
            name: "label$ebnf$3",
            symbols: [lexer.has("space") ? { type: "space" } : space],
            postprocess: id
        },
        {
            name: "label$ebnf$3",
            symbols: [],
            postprocess: function (d) {
                return null
            }
        },
        {
            name: "label",
            symbols: [
                "labelType",
                "label$ebnf$2",
                { literal: "(" },
                "signature",
                { literal: ")" },
                "label$ebnf$3",
                lexer.has("newline") ? { type: "newline" } : newline
            ],
            postprocess: ([[value, type, merge], _, __, signature]) => [
                value,
                type,
                merge,
                signature
            ]
        },
        {
            name: "labelType",
            symbols: [lexer.has("label") ? { type: "label" } : label],
            postprocess: (d) => [d[0].value, "label"]
        },
        {
            name: "labelType",
            symbols: [lexer.has("labeleq") ? { type: "labeleq" } : labeleq],
            postprocess: (d) => [d[0].value, "set"]
        },
        {
            name: "labelType",
            symbols: [lexer.has("labelplus") ? { type: "labelplus" } : labelplus],
            postprocess: (d) => [d[0].value, "all"]
        },
        {
            name: "labelType",
            symbols: [lexer.has("labelmerge") ? { type: "labelmerge" } : labelmerge],
            postprocess: (d) => [d[0].value, "label", true]
        },
        {
            name: "labelType",
            symbols: [lexer.has("labeleqmerge") ? { type: "labeleqmerge" } : labeleqmerge],
            postprocess: (d) => [d[0].value, "set", true]
        },
        {
            name: "labelType",
            symbols: [lexer.has("labelplusmerge") ? { type: "labelplusmerge" } : labelplusmerge],
            postprocess: (d) => [d[0].value, "all", true]
        },
        { name: "signature", symbols: ["signatureParam"], postprocess: (d) => [d[0]] },
        {
            name: "signature",
            symbols: ["signature", "_", { literal: "," }, "_", "signatureParam"],
            postprocess: (d) => [...d[0], d[4]]
        },
        { name: "signatureParam$ebnf$1", symbols: [{ literal: "?" }], postprocess: id },
        {
            name: "signatureParam$ebnf$1",
            symbols: [],
            postprocess: function (d) {
                return null
            }
        },
        {
            name: "signatureParam",
            symbols: [
                lexer.has("varname") ? { type: "varname" } : varname,
                "signatureParam$ebnf$1"
            ],
            postprocess: (d) => signatureParam(d[0].value, d[1] && true)
        },
        { name: "content$ebnf$1", symbols: ["line"] },
        {
            name: "content$ebnf$1",
            symbols: ["content$ebnf$1", "line"],
            postprocess: function arrpush(d) {
                return d[0].concat([d[1]])
            }
        },
        { name: "content", symbols: ["content$ebnf$1"], postprocess: id },
        {
            name: "line",
            symbols: [
                "preconditions",
                "parts",
                lexer.has("newline") ? { type: "newline" } : newline
            ],
            postprocess: (d) => choice(d[1], d[0])
        },
        {
            name: "line",
            symbols: ["requiredParts", lexer.has("newline") ? { type: "newline" } : newline],
            postprocess: (d) => (d[0] === null ? null : choice(d[0]))
        },
        {
            name: "group",
            symbols: [{ literal: "[" }, "choices", { literal: "]" }],
            postprocess: (d) => choices(d[1])
        },
        { name: "choices", symbols: ["choice"], postprocess: (d) => [d[0]] },
        {
            name: "choices",
            symbols: ["choices", { literal: "|" }, "choice"],
            postprocess: (d) => [...d[0], d[2]]
        },
        { name: "choice$ebnf$1", symbols: ["preconditions"], postprocess: id },
        {
            name: "choice$ebnf$1",
            symbols: [],
            postprocess: function (d) {
                return null
            }
        },
        {
            name: "choice",
            symbols: ["choice$ebnf$1", "parts"],
            postprocess: (d) => choice(d[1], d[0])
        },
        { name: "preconditions$ebnf$1", symbols: ["conditions"], postprocess: id },
        {
            name: "preconditions$ebnf$1",
            symbols: [],
            postprocess: function (d) {
                return null
            }
        },
        {
            name: "preconditions",
            symbols: [{ literal: "{" }, "preconditions$ebnf$1", { literal: "}" }],
            postprocess: (d) => d[1] || []
        },
        { name: "conditions", symbols: ["condition"], postprocess: (d) => [d[0]] },
        {
            name: "conditions",
            symbols: ["conditions", { literal: "," }, "condition"],
            postprocess: (d) => [...d[0], d[2]]
        },
        {
            name: "condition",
            symbols: ["conditionValue"],
            postprocess: (d) => soloValueComparison(d[0])
        },
        {
            name: "condition",
            symbols: [lexer.has("compare") ? { type: "compare" } : compare, "conditionValue"],
            postprocess: (d) => preComparison(null, d[0].value, d[1])
        },
        {
            name: "condition",
            symbols: [
                "conditionValue",
                lexer.has("compare") ? { type: "compare" } : compare,
                "conditionValue"
            ],
            postprocess: (d) => preComparison(d[0], d[1].value, d[2])
        },
        {
            name: "conditionValue",
            symbols: [lexer.has("number") ? { type: "number" } : number],
            postprocess: (d) => numberValue(d[0].value)
        },
        {
            name: "conditionValue",
            symbols: ["requiredParts"],
            postprocess: (d) => compoundValue(d[0])
        },
        { name: "parts$ebnf$1", symbols: [] },
        {
            name: "parts$ebnf$1",
            symbols: ["parts$ebnf$1", "part"],
            postprocess: function arrpush(d) {
                return d[0].concat([d[1]])
            }
        },
        { name: "parts", symbols: ["parts$ebnf$1"], postprocess: (d) => flatParts(d[0] || []) },
        { name: "requiredParts$ebnf$1", symbols: ["part"] },
        {
            name: "requiredParts$ebnf$1",
            symbols: ["requiredParts$ebnf$1", "part"],
            postprocess: function arrpush(d) {
                return d[0].concat([d[1]])
            }
        },
        {
            name: "requiredParts",
            symbols: ["requiredParts$ebnf$1"],
            postprocess: (d) => flatParts(d[0])
        },
        { name: "part", symbols: ["string"], postprocess: (d) => textContent(d[0]) },
        { name: "part", symbols: ["assignment"], postprocess: id },
        { name: "part", symbols: ["substitution"], postprocess: id },
        { name: "part", symbols: ["input"], postprocess: id },
        { name: "part", symbols: ["group"], postprocess: id },
        { name: "part", symbols: ["functionCall"], postprocess: id },
        { name: "part", symbols: ["comment"], postprocess: empty },
        {
            name: "string",
            symbols: [lexer.has("string") ? { type: "string" } : string],
            postprocess: (d) => d[0].value
        },
        {
            name: "string",
            symbols: [lexer.has("escape") ? { type: "escape" } : escape],
            postprocess: (d) => d[0].value
        },
        {
            name: "string",
            symbols: [lexer.has("space") ? { type: "space" } : space],
            postprocess: (d) => d[0].value
        },
        {
            name: "comment",
            symbols: [lexer.has("lineComment") ? { type: "lineComment" } : lineComment],
            postprocess: empty
        },
        {
            name: "comment",
            symbols: [
                lexer.has("blockComment") ? { type: "blockComment" } : blockComment,
                lexer.has("string") ? { type: "string" } : string,
                lexer.has("endComment") ? { type: "endComment" } : endComment
            ],
            postprocess: empty
        },
        {
            name: "assignment",
            symbols: [
                lexer.has("assign") ? { type: "assign" } : assign,
                "choices",
                lexer.has("nospaceend") ? { type: "nospaceend" } : nospaceend
            ],
            postprocess: (d) => assignContent(d[0].value, d[1])
        },
        {
            name: "assignment",
            symbols: [
                lexer.has("bassign") ? { type: "bassign" } : bassign,
                "choices",
                lexer.has("nospaceend") ? { type: "nospaceend" } : nospaceend
            ],
            postprocess: (d) => assignContent(d[0].value, d[1])
        },
        {
            name: "substitution",
            symbols: ["substitutionPath", lexer.has("pathend") ? { type: "pathend" } : pathend],
            postprocess: (d) => subContent(d[0])
        },
        {
            name: "functionCall",
            symbols: ["substitutionPath", { literal: "(" }, "parameters", { literal: ")" }],
            postprocess: (d) => functionCallContent(d[0], d[2])
        },
        {
            name: "substitutionPath",
            symbols: [lexer.has("sub") ? { type: "sub" } : sub],
            postprocess: (d) => [d[0].value]
        },
        {
            name: "substitutionPath",
            symbols: [lexer.has("bsub") ? { type: "bsub" } : bsub, "choices", { literal: "]" }],
            postprocess: (d) => [choices(d[1])]
        },
        {
            name: "substitutionPath",
            symbols: [lexer.has("sub") ? { type: "sub" } : sub, "substitutionPathParts"],
            postprocess: (d) => [d[0].value, ...d[1]]
        },
        {
            name: "substitutionPath",
            symbols: [
                lexer.has("bsub") ? { type: "bsub" } : bsub,
                "choices",
                { literal: "]" },
                "substitutionPathParts"
            ],
            postprocess: (d) => [choices(d[1]), ...d[3]]
        },
        { name: "substitutionPathParts$ebnf$1", symbols: ["substitutionPathPart"] },
        {
            name: "substitutionPathParts$ebnf$1",
            symbols: ["substitutionPathParts$ebnf$1", "substitutionPathPart"],
            postprocess: function arrpush(d) {
                return d[0].concat([d[1]])
            }
        },
        {
            name: "substitutionPathParts",
            symbols: ["substitutionPathParts$ebnf$1"],
            postprocess: id
        },
        {
            name: "substitutionPathPart",
            symbols: [lexer.has("path") ? { type: "path" } : path],
            postprocess: (d) => d[0].value
        },
        {
            name: "substitutionPathPart",
            symbols: [lexer.has("bpath") ? { type: "bpath" } : bpath, "choices", { literal: "]" }],
            postprocess: (d) => choices(d[1])
        },
        { name: "parameters", symbols: ["parameter"], postprocess: (d) => [d[0]] },
        {
            name: "parameters",
            symbols: ["parameters", { literal: "," }, "parameter"],
            postprocess: (d) => [...d[0], d[2]]
        },
        { name: "parameter", symbols: ["choices"], postprocess: (d) => choices(d[0]) },
        {
            name: "input",
            symbols: [lexer.has("input") ? { type: "input" } : input],
            postprocess: (d) => inputContent()
        },
        { name: "_$ebnf$1", symbols: [] },
        {
            name: "_$ebnf$1",
            symbols: ["_$ebnf$1", "whitespace"],
            postprocess: function arrpush(d) {
                return d[0].concat([d[1]])
            }
        },
        { name: "_", symbols: ["_$ebnf$1"], postprocess: empty },
        {
            name: "whitespace$subexpression$1",
            symbols: [lexer.has("newline") ? { type: "newline" } : newline]
        },
        {
            name: "whitespace$subexpression$1",
            symbols: [lexer.has("space") ? { type: "space" } : space]
        },
        { name: "whitespace$subexpression$1", symbols: ["comment"] },
        { name: "whitespace", symbols: ["whitespace$subexpression$1"], postprocess: empty }
    ],
    ParserStart: "main"
}
export default grammar
