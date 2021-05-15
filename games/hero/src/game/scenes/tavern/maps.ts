import { map } from "@hero/map";

const doorWays = map`
#++#####++#

#O#+###+#O#

#OO#+++#OO#

// @tag(room:well-lit)

##O#+#+#O##

##+##O##O##

#O###OO#+##

###+###OO##
`;

export const interior1 = map`
###########
#dddddd..♪#
#BBBBBB..☺#
#======...#
#.........#
#hTh...hTh#
#.........#
#.hTh.hTh.#
#.........#
#hTh...hTh#
#.........#
@@@@@@@@@@@

** = @class(room)

[.♪☺BcT] = Floor

// Hmm, this has to overlap with the exterior
@ = (+:1 + #) | (+:2 + #) | ( ${doorWays} )

@ = Door + Player
+ = Door
# = Wall
= = Bar + ( Beer | )
♪ = Piano
☺ = Pianist
B = Barkeep:1
h = Chair
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
