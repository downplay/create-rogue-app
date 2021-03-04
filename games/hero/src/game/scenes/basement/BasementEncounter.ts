import { text } from "herotext";
import { map } from "heromap";

const basementMap = ({ stairs, decor }) => {
  return map`
##t#t#t#t#t#
#^...O.....t
t..O......O#
#....O.O...t
t........O.#
#.O....rr..t
t...O.rrrr.#
#......rBRrt
t..O....r..#
#t#t#tt#t#t#

${environment}?
dark: {
    . = Floor
    t = Wall
}
flooded: {
    . = Water
    t = Wall
}
torch-lit: {
    . = Floor
    t = Torch:30%
}
[^#^] = Floor
# = Wall
r = Rat:50%
// Boss rat(s)
BR = [RB] | [BR]  // Shuffle
B = Rat(size:5,name:Rat King)
R = Rat(size:4,name:Rat Queen):50%
^ = ${stairs}
o = ${decor}
`;
};

const basementStory = text`
You walk down the steps into the $environment basement. 

map:
${basementMap}

decor:=
Barrel
Pillar

environment:=
dark
flooded
torch-lit

`;
