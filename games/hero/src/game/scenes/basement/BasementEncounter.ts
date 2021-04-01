import { text, StoryInstance, MainAST } from "herotext";
import { map } from "heromap";

type MapProps = {
  stairs: StoryInstance;
  decor: MainAST;
  environment: string;
};

const basementMap = ({ stairs, decor, environment }: MapProps) => {
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

match("${environment}")
  dark:
    . = Floor
    t = Wall
  flooded:
    . = Water
    t = Drain:1/3 | Wall
  torch-lit:
    . = Floor
    t = Torch:1/3 | Wall

** = Floor
# = Wall
r = Rat:50%
// Boss rat(s)
BR = [RB] | [BR]  // Shuffle
B = Rat(size:5,name:"Boss Rat")
R = Rat(size:4,name:"Queen Rat"):50%
^ = ${stairs}
O = ${decor}
`;
};

export const BasementStory = text<MapProps>`
You walk down the steps into the $environment basement. $plural($decor) are strewn around the place.

setup:
$map(${basementMap})

decor:=
Barrel
Pillar

environment:=
dark
flooded
torch-lit

`;
