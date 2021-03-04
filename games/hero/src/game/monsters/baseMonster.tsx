import { text } from "herotext";
export const baseMonster = text`
hp:%=
$maxhp

maxhp:%
1

Description:
$DescribeLook.$DescribeHealth

DescribeHealth:
{$hp==$maxhp}
{$hp=0}It is dead.
{0%} $DescribePartialHealth(<$hp/$maxhp>)

DescribePartialHealth: ($fraction)
It is [{$fraction>0.75} slightly hurt|[{0.25>=$fraction>=0.75}half|{$fraction<0.25}nearly] dead].
`;
