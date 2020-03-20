import React, { useRef } from "react";
import { RoadLayout } from "../../biomes/plains/RoadLayout";
import { text } from '../../../engine/text/parse';
import { entity } from '../../../engine/entity';
import { Mage } from './Mage';
import { EntityContext } from '../../../engine/useEntitiesState';

// TODO: Figure out a good way to reuse things between text templates

enum Genders {
    Male = "male",
    Female = "female"
}

type WanderingMageState = {
    gender: Genders,
    name: string,
    kind: string
}

// TODO:
// Many scenes (e.g. this, tavern) are transferrable to different biomes. RoadLayout would come from the biome tagged as "OutdoorsLayout",
// (or it could internally adapt different road/floor tiles and other inserts for misc entities). It will still produce flags to place
// additional scene elements at roadside or wherever. Need to ensure a definite spawn order: the tavern should spawn before any flora/fauna
// so it doesn't spawn solid materials on top of wildlife.
// Something like the mage can adapt with different costumes and inventory. Familiar could be biome-appropriate animal.

export const WanderingMageEncounter = entity(() => {
  const mageRef = useRef<EntityContext>();

  const state:WanderingMageState = useStory(()=>{
    const warningFireball = async (state:WanderingMageState) => {
        // TODO: Some contortions required here if we want to avoid promises (for savegame support).
        // Need a ref to a story handle (2nd arg to this callback) that can be resolved when the fireball lands.
        // On rehydate, we'll need to get back to this point and can call this function again;
        // and the state that instances the fireball needs to be restored.
        // Could handle this by using predetermined id (e.g. "WanderingMageWarningFireball")
        // Also consider state machines (useful also for e.g switching behaviours, see Barkeep)
        mageRef
        return "FWOOOOOOM!"
    }
  return text`(<NULL($gender=genders)>
By the side of the track you see <A($appearance)> $(kind=$(gender)Kinds)),
accompanied by <A($appearance)> $(familiar=$familiars). <TITLE($subjectPronoun)> looks up as
you approach, cocks $possessivePronoun head on one side, and $observes. The $familiar $familiarVerbs.
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
rat
bat

familiarVerbs:
$(kind=$(familiar)Kinds))

catVerbs:
hisses
arches its back
licks its paws
mews

dogVerbs:
growls
barks
yaps excitedely
says, "Ruff!"
looks hungry

ratVerbs:
squeaks
scurries under $possessivePronoun robes
casts its beady eyes towards you

batVerbs:
chitters
doesn't make a sound, but somehow you feel that it did
flaps its leathery wings

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
hurls a fireball in your direction!${warningFireball} It narrowly misses you. "Just a warning shot," $subjectPronoun says, $seriously

seriously:
pointedly
seriously
threateningly
intimidatingly
weightily
gruffly
`;
  }

// TODO: changing the name should update the state
hasName(state.name||state.kind)

  return (
    <>
      <RoadLayout />
      <Mage ref={mageRef} />
      <Familiar owner={mageRef} />
      {children}
    </>
  );
};
