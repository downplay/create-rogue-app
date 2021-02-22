export const interior1 = () => {
  return map`
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

# = ${wall}
. = ${floor}
@ = ${door} + ${player}
= = ${bar} + (${beer}|)
♪ = ${floor} + ${piano}
☺ = ${floor} + ${pianist}
B = ${floor} + flag(${FLAG_BARKEEP_SPAWN})
c = ${floor} + ${chair}
T = ${floor} + ${table} + (${beer}|)
d = ${barrel}|${shelves}
`;
};
