import { createInstance, StoryInstance, text } from "herotext";
import { Dog } from "../../monsters/Dog";
import { Cat } from "../../monsters/Cat";
import { Rat } from "../../monsters/Rat";
import { Bat } from "../../monsters/Bat";

const familiarTypes = {
  Cat,
  Bat,
  Rat,
  Dog,
};

export type FamiliarState = {
  owner: StoryInstance;
};

type HasFamiliarState = {
  familiarType: keyof typeof familiarTypes;
  familiar: StoryInstance<FamiliarState>;
};

// Could theoretically change type at any point to morph the familiar
export const hasFamiliar = (
  familiarType?: keyof typeof familiarTypes
) => text<HasFamiliarState>`
setup:+~
$void($familiarType $familiar)

familiar:=
${({ familiarType }) => createInstance(familiarTypes[familiarType])}

familiarType:=
{?${familiarType}}${familiarType}
{40%}Cat
{40%}Dog
Rat
{2%}Bug
`;
