import { text, commonFunctions } from "herotext";
import React, { useRef } from "react";
import { RoadLayout } from "../../biomes/plains/RoadLayout";
import { entity } from "../../../engine/entity";
import { Mage } from "./Mage";
import { EntityContext } from "../../../engine/useEntitiesState";
import { useStory } from "../../../engine/useStory";
import { hasName } from "../../../engine/hasName";

// TODO: Figure out a good way to reuse things between text templates

enum Genders {
  Male = "male",
  Female = "female",
}

type WanderingMageStory = {
  gender: Genders;
  name: string;
  kind: string;
};

// TODO:
// Many scenes (e.g. this, tavern) are transferrable to different biomes. RoadLayout would come from the biome tagged as "OutdoorsLayout",
// (or it could internally adapt different road/floor tiles and other inserts for misc entities). It will still produce flags to place
// additional scene elements at roadside or wherever. Need to ensure a definite spawn order: the tavern should spawn before any flora/fauna
// so it doesn't spawn solid materials on top of wildlife.
// Something like the mage can adapt with different costumes and inventory. Familiar could be biome-appropriate animal.

export const WanderingMageEncounter = entity(() => {
  const mageRef = useRef<EntityContext>();

  const [story, dispatch] = useStory<WanderingMageStory>(() => {
    const warningFireball = async (state: WanderingMageStory) => {
      // TODO: Some contortions required here if we want to avoid promises (for savegame support).
      // Need a ref to a story handle (2nd arg to this callback) that can be resolved when the fireball lands.
      // On rehydate, we'll need to get back to this point and can call this function again;
      // and the state that instances the fireball needs to be restored.
      // Could handle this by using predetermined id (e.g. "WanderingMageWarningFireball")
      // Also consider state machines (useful also for e.g switching behaviours, see Barkeep)
      // mageRef.current.
      return "FWOOOOOOM!";
    };
    const seriousFireball = async (state: WanderingMageStory) => {
      return "FFWOOOOARRRRRMMMM!!!";
    };
    return text`(<null($gender=$genders)>
By the side of the track you see $a<$appearance> $(kind=$(gender)Kinds)),
accompanied by $a($appearance) $(familiar=$familiars). <title($subjectPronoun)> looks up as
you approach, cocks $possessivePronoun head on one side, and $observes. The $familiar $familiarVerbs.
(@aggressive?$title($subjectPronoun) $subjectVerb(attack) you!
:$dialog)
)

dialog:
("So, are you going to tell me why I shouldn't just roast you alive, right here on the spot?" asks the $kind.
* Tell them about your quest => $dialogQuest
* Lie about your intentions => $dialogLie
* Plea for help => $dialogHelp
* Throw their question back at them => $dialogQuestion
* Try to surprise them with an attack => $dialogAttack)

dialogQuest:
"I wish to end the blight on this (land|world|realm). Stand aside and let me pass, unless you sympathize with the Evil one."$dialogQuestResponse

[80]
[20]A dark look crosses the $kind's face. "I see... in that case, the Evil One will surely pay me handsomely for your head!"($aggressive=true)

${commonFunctions}

appearance:=
mangy
shabby
ragged
twitchy
scrawny
singed

gender:=
male
female

maleKinds:=
mage
wizard
sorceror

femaleKinds:=
magess
witch
enchantress

familiars:
cat
dog
rat
bat

familiarVerbs:
$(kind=$(familiars)Verbs))

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
[$gender==neutral]they
($gender==female?s)he

possessivePronoun:
[$gender==female]her
[$gender==male]his

subjectVerb(verb):
@verb($gender!=neutral?s)

observes:
swints sideways at you
glares in your direction
puzzledly watches you
gazes at a point several feet behind you
hurls a fireball in your direction!${warningFireball} It narrowly misses you. "Just a warning shot," $subjectPronoun $subjectVerb(say), $seriously
[1%]hurls a fireball in your direction!(@aggressive=true)${seriousFireball}

seriously:
pointedly
seriously
threateningly
intimidatingly
weightily
gruffly
`;
  });

  // TODO: changing the name should update the state
  hasName(story.name || story.kind);

  return (
    <>
      <RoadLayout />
      <Mage entityRef={mageRef} />
      <Familiar owner={mageRef.current} />
      {children}
    </>
  );
});
