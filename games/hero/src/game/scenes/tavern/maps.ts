import { map } from "heromap";

export const interior1 = map`
###########
#dddddd..♪#
#BBBBBB..☺#
#======...#
#.........#
#cTc...cTc#
#.........#
#.cTc.cTc.#
#.........#
#cTc...cTc#
#####@#####

[.♪☺BcT] = Floor

# = Wall
@ = Door + Player
= = Bar + ( Beer | )
♪ = Piano
☺ = Pianist
B = Barkeep:1
c = Chair
T = Table + ( Beer | )
d = Barrel | Shelving
`;

export const exterior1 = map`
######
#UUUU#
#UUUU#
#UUUU#
#UUUU#
#++++#

# = Wall
U = Roof
+ = Door:1 | Wall
`;
