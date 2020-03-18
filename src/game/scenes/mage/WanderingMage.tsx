import React, { useRef } from "react";
import { RoadLayout } from "../../biomes/plains/RoadLayout";

// TODO:
// Many scenes (e.g. this, tavern) are transferrable to different biomes. RoadLayout would come from the biome tagged as "OutdoorsLayout",
// (or it could internally adapt different road/floor tiles and other inserts for misc entities). It will still produce flags to place
// additional scene elements at roadside or wherever. Need to ensure a definite spawn order: the tavern should spawn before any flora/fauna
// so it doesn't spawn solid materials on top of wildlife.
// Something like the mage can adapt with different costumes and inventory. Familiar could be biome-appropriate animal.

export const WanderingMage = () => {
  const mageRef = useRef();

  const state = useStory`(<NULL($gender=genders)>
By the side of the track you see <A($appearance)> $(wizard=$(gender)Kinds)),
accompanied by <A($appearance)> $(familiar=$familiars). <TITLE($subjectPronoun)> looks up as
you approach, cocks $possessivePronoun head on one side, and $observes.
)

appearance:
mangy
shabby
ragged
twitchy
scrawny

genders:
male
female

maleKinds:
mage
wizard
sorceror

femaleKinds:
mage
witch
enchantress

familiars:
cat
dog
rabbit
bat

subjectPronoun:
<IS($gender,female)?s>he

possessivePronoun:
[$gender=female]her
[$gender=male]his

observes:
swints sideways at you
glares in your direction
puzzledly watches you
gazes at a point several feet behind you
hurls a fireball in your direction! ${warningFireball} It narrowly missing you. "Just a warning shot," $subjectPronoun says, $seriously.

seriously:
pointedly
seriously
threateningly
intimidatingly
weightily
gruffly
`;

  return (
    <>
      <RoadLayout />
      <Mage ref={mageRef} />
      <Familiar owner={mageRef} />
    </>
  );
};
