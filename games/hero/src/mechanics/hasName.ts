import { render, RNG } from "herotext";

export const LABEL_NAME = "Name";

export const getName = (instance: StoryInstance, rng: RNG) =>
  render(instance.main, rng, instance.globalScope, LABEL_NAME);
