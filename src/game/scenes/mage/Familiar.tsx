import React, { useState, Props } from "react";
import { Emoji } from "../../../ui/Typography";
import { useRng } from "../../../engine/useRng";
import { EntityContext } from "../../../engine/useEntitiesState";

const CatTile = () => <Emoji>🐈</Emoji>;
const DogTile = () => <Emoji>🐕</Emoji>;

const familiarTypes = {
  cat: Cat,
  bat: Bat,
  rat: Rat,
  dog: Dog,
};

type Props = {
  owner: EntityContext;
};

export const Familiar = ({ owner }: Props) => {
  const rng = useRng();

  /* TODO: Could theoretically change type at any point to morph the familiar.
     This useState should be converted to some kind of "usePersistedState".
     Or. Does Familiar become another entity with its own state */
  const [familiarType] = useState(() => rng.pick(Object.keys(familiarTypes)));

  const FamiliarComponent = familiarTypes[familiarType];

  return (
    <FamiliarComponent>
      <FamiliarBehavior></FamiliarBehavior>
    </FamiliarComponent>
  );
};
