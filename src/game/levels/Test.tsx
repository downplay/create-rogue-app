import React from "react";
import { vector } from "../../engine/vector";
import { Room } from "./Room";

const ROOM_SIZE = vector(32, 32);

export const Test = () => {
  return <Room size={ROOM_SIZE}></Room>;
};
