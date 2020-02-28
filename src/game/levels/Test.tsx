import { vector } from "../../engine/vector";

const ROOM_SIZE = vector(32, 32);

export const Test = () => {
  return <Room size={ROOM_SIZE}></Room>;
};
