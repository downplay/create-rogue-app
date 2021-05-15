//const moo = require("moo");
const newline = { match: /[^\S\n]/, lineBreaks: true };

const lexer = moo.states({
  // Consume all whitespace until we see first line that contains at least one non-whitespace char
  begin: {
    space: { match: /\s/, lineBreaks: false },
    newline,
    firstCharLine: { match: /(?=[\s]*[^\s\n])/, push: "map" },
  },
  map: {
    newline: { match: /\n/, lineBreaks: true },
    chars: moo.default,
  },
});
