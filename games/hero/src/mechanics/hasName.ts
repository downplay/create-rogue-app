import { render, RNG, StoryInstance } from "herotext";

export const LABEL_NAME = "Name";

export const getName = (instance: StoryInstance, rng: RNG) =>
  render(instance.story, rng, instance.globalScope, LABEL_NAME);
