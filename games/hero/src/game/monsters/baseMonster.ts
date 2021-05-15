import { text, merge, commonFunctions, MainAST } from "@hero/text";
import { grammarHelpers } from "../../engine/grammarHelpers";
import { canLiveAndDie } from "../../mechanics/hasLife";
import { hasPosition } from "../../mechanics/hasPosition";
// import { hasSpawnFlag } from "../behaviours/hasSpawnFlag";

export const baseMonster = text`
hp:%=
$maxhp

maxhp:%
1

isMonster:=
true

gender:=
male
female
neutral

Pronoun:
{$gender=male}He
{$gender=female}She
{0}It

Description:
[$DescribeLook].$DescribeHealth

DescribeHealth:
{$hp==$maxhp}
{$hp=0}$Pronoun is dead.
{0%} $DescribePartialHealth(<$hp/$maxhp>)

DescribePartialHealth: ($fraction)
It is [{$fraction>0.75} slightly hurt|[{0.25>=$fraction>=0.75}half|{$fraction<0.25}nearly] dead].
`;

export const monster = (...stories: MainAST[]) =>
  merge(
    commonFunctions,
    grammarHelpers,
    baseMonster,
    hasPosition(),
    // hasSpawnFlag(),
    canLiveAndDie(),
    ...stories
  );
