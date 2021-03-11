import { Emoji } from "../../../ui/Typography";
import { StoryInstance, text, merge } from "herotext";
import { Dog } from "../../monsters/Dog";
import { Cat } from "../../monsters/Cat";
import { Rat } from "../../monsters/Rat";
import { Bat } from "../../monsters/Bat";
import { storyInstance } from "herotext";

const CatTile = () => <Emoji>🐈</Emoji>;

const familiarTypes = {
  Cat,
  Bat,
  Rat,
  Dog,
};

type FamiliarState = {
  owner: StoryInstance;
};

type HasFamiliarState = {
  familiarType: string;
  familiar: StoryInstance<FamiliarState>;
};

// Could theoretically change type at any point to morph the familiar
export const hasFamiliar = (familiarType?: string) => text<HasFamiliarState>`
setup:~
$void($familiarType $familiar)

familiar:=
${({ familiarType }) => storyInstance(familiarTypes[familiarType])}

familiarType:=
{?${familiarType}}$familiarType
{40%}Cat
{40%}Dog
Rat
{2%}Bug
`;
