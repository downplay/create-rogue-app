@builtin "whitespace.ne" # `_` means arbitrary amount of whitespace
@builtin "number.ne"     # `int`, `decimal`, and `percentage` number primitives

@{%
var appendItem = function (a, b) { return function (d) { return d[a].concat([d[b]]); } };
var appendItemChar = function (a, b) { return function (d) { return d[a].concat(d[b]); } };
var empty = function (d) { return []; };
var emptyStr = function (d) { return ""; };

const buildPhrase = (nphrase, nnext) => d => {

	const phrase = d[nphrase]
	const next = d[nnext]

	if (typeof next === "string") {
		if (!phrase) {
            return { type: "text", text: next };
		}
		
		if (phrase.type === "text") {
			return {...phrase, text: phrase.text + next}
		}
		
		if (Array.isArray(phrase)) {
			const last = phrase[phrase.length - 1];
			if (last.type === "text") {
				return [...phrase.slice(0, phrase.length - 1), {...last, text: last.text + next}];
			}
			return [...phrase, {type: "text", text: next}];
		}
		
		return [phrase, { type: "text", text: next }]
	}
	
	if (typeof phrase === "string") {
		if (next.type === "text") {
			return { ...next, text: phrase + next.text }
		}
		return [{ type: "text", text: phrase }, next]
	}

	
	return phrase ? [phrase,next]: next
}
	  	  
%}

main              -> _ content _ labelSections _   {% d => ({type: "main", choices:d[1], labels:d[3]}) %}
                   | _ content _                   {% d => ({type: "main", choices:d[1]}) %}

content           -> bulletList                      {% id %}
                   | line							{% id %}

bulletList        -> bulletLine                 {% d => [d[0]] %}
                   | bulletList newline bulletLine      {% appendItem(0,2) %}

bulletLine        -> "-" __ phrase                {% d => d[2] %}

line              -> nonBulletChar phrase _ newline       {% buildPhrase(0,1) %}
					
phrase            -> phraseChar                         {% buildPhrase(1,0) %}
                   | phrase phraseChar                  {% buildPhrase(0,1) %}
                   | phrase substitution                {% buildPhrase(0,1) %}
                   | phrase choice                      {% buildPhrase(0,1) %}
				   

newline           -> "\r" "\n"                                {% empty %}
                   | "\r" | "\n"                              {% empty %}

nonBulletChar        -> [^\-\n\r]                            {% id %}

phraseChar        -> [^\n\r\(\)\$|]                            {% id %}

labelSections     -> labelSection                   {% d => [d[0]] %}
                   | labelSections labelSection         {% appendItem(0,1) %}

labelSection      -> label content                     {% d => ({type: "label", name: d[0].name, choices: d[1]}) %}

label             -> _ newline word ":" newline _    {% d => ({type: "label", name: d[2]}) %}

word              -> wordChar                            {% id %}
                   | word wordChar             {% appendItemChar(0,1) %}

wordChar          -> [a-zA-Z0-9]                                {% id %}

substitution      -> "$" word                        {% d => ({ type: "substitution", label: d[1] }) %}

choice            -> "(" choiceItems ")"             {% d=> ({ type: "choices", choices: d[1] }) %}

choiceItems       -> choiceItem                      {% d => [d[0]] %}      
                   | choiceItems "|" choiceItem      {% d => ([...d[0],d[2]]) %}

choiceItem        -> phrase