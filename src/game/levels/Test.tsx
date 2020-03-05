import React from "react";
import { vector } from "../../engine/vector";
import { Room } from "./Room";
import { Rat } from "../monsters/Rat";

const ROOM_SIZE = vector(32, 32);

export const Test = () => {
  return (
    <Room size={ROOM_SIZE}>
      <Rat />
      <Rat />
      <Rat />
      <Rat />
      <Rat />
      <Rat />
    </Room>
  );
};
