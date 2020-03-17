import React, { useMemo } from "react";
import { useRng } from "../../../engine/useRng";
import { Ascii } from "../../../ui/Typography";

const variants = ["w", "i", "v", "l", "/", "", ""];

const colors = [
  "#3D471D",
  "#485827",
  "#536B33",
  "#5C7E41",
  "#649250",
  "#6BA660"
];

export const GrassTile = () => {
  const rng = useRng();

  const [variant, bg, fg] = useMemo(
    () => [rng.pick(variants), rng.pick(colors), rng.pick(colors)],
    []
  );

  return (
    <Ascii fore={fg} back={bg}>
      {fg === bg ? "" : variant}
    </Ascii>
  );
};
