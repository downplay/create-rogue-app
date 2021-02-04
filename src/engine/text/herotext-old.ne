@{%

const moo = require('moo')

const lexer = moo.compile({
  number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  assign: /\$[a-zA-Z]+=[a-zA-Z]+/,
  bassign: /\$\([a-zA-Z]+=[a-zA-Z]+\)/,
  sub: /\$[a-zA-Z]+/,
  bsub: /\$\([a-zA-Z]+\)/,
  bang: /^!/,
  label: /^[a-zA-Z0-9]+:$/,
  string: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\n\r|])+/,
  newline: { match: /(?:\r\n|\r|\n)/, lineBreaks:true },
  space: { match: /[.\t]+/, lineBreaks: false },
  '$': '$',
  '(': '(',
  ')': ')',
  '|': '|',
  ':': ':',
  '!': '!',
  true: 'true',
  false: 'false',
  null: 'null',
})

const empty = () => null

const textContent = (text) => ({type:"text", text})

const subContent = (label) => ({type:"substitution", label})

const assignContent = (ab) => {
	const split = ab.split("=");
	return ({type:"assignment", label: split[1], variable: split[0]})
}

const choice = (content) => ({type:"choice", content, weight: 10})

const main = (choices, labels) => ({type: "main", choices, labels})

const label = (name, choices) => ({type: "label", name, choices})

const mergeParts = (a, b) => {
	while (a[a.length-1] && a[a.length-1].type === "text" && b.type === "text") {
		b = {
			...b,
			text: a[a.length-1].text + b.text
		};
		a = a.slice(0, a.length-1);
	}
	return [...a, b];
}

const bracketSlice = value => value.slice(2, value.length - 1)

%}

@lexer lexer

main             -> _ content _                    {% d => main(d[1], []) %}
                  | _ content _ labels _           {% d => main(d[1], d[3]) %}
				  
content          -> line                           {% d => [d[0]] %}
                  | content line                   {% d => [...d[0], d[1]] %}
				  | content bangLine                       {% d => [...d[0], d[1]] %}
				  
labels           -> labelledContent                {% d => [d[0]] %}	
                  | labels labelledContent         {% d => [...d[0], d[1]] %}
				  
labelledContent  -> _ label _ content              {% d => label(d[1], d[3]) %}

label            -> newline %label newline         {% d => d[1].value.slice(0, d[1].value.length - 1) %}

line              -> parts newline                 {% d => choice(d[0]) %}

bangLine          -> "!" parts:? newline           {% d => choice(d[1] || []) %}

parts             -> part                          {% d => [d[0]] %}
                   | parts part                    {% d => [...d[0], d[1]] %}

part              -> string                        {% d => textContent(d[0]) %}
                   | complexPart                   {% id %}

complexPart       -> choice                        {% id %}
                   | substitution                  {% id %}
                   | assignment                    {% id %}

choice            -> "(" choiceItems ")"           {% d=> ({ type: "choices", choices: d[1] }) %}

choiceItems       -> choiceItem                    {% d => [choice(d[0])] %}      
                   | choiceItems "|" choiceItem    {% d => ([...d[0],choice(d[2])]) %}

choiceItem        -> choicePart                    {% d => [d[0]] %}
                   | choiceItem choicePart         {% d => mergeParts(d[0], d[1]) %}
				   
choicePart        -> string                        {% d => textContent(d[0]) %}
                   | newline                       {% d => textContent("\n") %}
                   | complexPart                   {% d => d[0] %}

substitution      -> %sub                          {% d => subContent(d[0].value.slice(1)) %}
                   | %bsub                         {% d => subContent(bracketSlice(d[0].value)) %}

assignment        -> %assign                       {% d => assignContent(d[0].value.slice(1)) %}
                   | %bassign                      {% d => assignContent(bracketSlice(d[0].value)) %}

string            -> %string                       {% d => d[0].value %}

newline           -> %newline                      {% empty %}

_                 -> %space                        {% empty %} 
                   | %newline                      {% empty %}
                   | null                          {% empty %}
