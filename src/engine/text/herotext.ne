@{%

// const moo = require('moo')

let lexer = moo.compile({
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
	sub: /\$[a-zA-Z0-9]+/,
	bang: /^!/,
	label: /^[a-zA-Z0-9]+:$/,
    string: /(?:\$\$|\(\(|\)\)|\\[\\()\$]|\\u[a-fA-F0-9]{4}|[^\\()\$\n\r|])+/,
	newline: {match:/(?:\r\n|\r|\n)/, lineBreaks:true},
    space: {match: /[.\t]+/, lineBreaks: false},
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

const choice = (content) => ({type:"choice", content, weight: 10})

const main = (choices, labels) => ({type: "main", choices, labels})

const label = (name, choices) => ({type: "label", name, choices})

%}

@lexer lexer

main             -> _ content _                               {% d => main(d[1]) %}
                  | _ content _ labels _                {% d => main(d[1], d[3]) %}
				  
content          -> line                               {% d => [d[0]] %}
                  | content line                       {% d => [...d[0], d[1]] %}
				  | content bangLine                       {% d => [...d[0], d[1]] %}
				  
labels           -> labelledContent                      {% d => [d[0]] %}	
                  | labels labelledContent              {% d => [...d[0], d[1]] %}
				  
labelledContent  -> _ label _ content                  {% d => label(d[1], d[3]) %}

label            -> newline %label newline             {% d => d[1].value.slice(0, d[1].value.length - 1) %}

line              -> parts newline                     {% d => choice(d[0]) %}

bangLine          -> "!" parts:? newline                 {% d => choice(d[1] || []) %}

parts             -> part                              {% d => [d[0]] %}
                   | parts part                        {% d => [...d[0], d[1]] %}

part              -> string                           {% d => textContent(d[0]) %}
                   | complexPart                      {% id %}

complexPart       -> choice                           {% id %}
                   | substitution                     {% id %}

choice            -> "(" choiceItems ")"             {% d=> ({ type: "choices", choices: d[1] }) %}

choiceItems       -> choiceItem                      {% d => [choice(d[0])] %}      
                   | choiceItems "|" choiceItem      {% d => ([...d[0],choice(d[2])]) %}

choiceItem        -> choicePart                      {% id %}
                   | choiceItem choicePart           {% d => [...d[0], d[1]]  %}
				   
choicePart        -> multiline                       {% d => textContent(d[0]) %}
                   | complexPart                       {% id %}

multiline         -> string                        {% id %}
                   | string newline multiline      {% d => d[0] + "\n" + d[2] %}

substitution      -> %sub                          {% d => subContent(d[0].value.slice(1)) %}
                   | "$" "(" string ")"             {% d => subContent(d[2]) %}

string            -> %string                       {% d => d[0].value %}

newline           -> %newline                                {% empty %}

_                 -> %space                                   {% empty %} 
                   | %newline                                 {% empty %}
                   | null                                     {% empty %}
