// Maybe an AncientEgg is similar to Egg but will hatch stuff like dinosaurs, unicorns...

const Egg = defineEntity(() => {
  onModify(({ modifier }) => {
    // Pseudo code
    // If modifier is a lizard, hatch a baby dinosaur/dragon
    // If modifier is wings, hatch
  });
});

const EggItem = defineEntity(() => {
  isItem();
  canDeploy(Egg);
  canModify(() => {
    // Playing an egg on a living entity causes them to
    // lay an egg that will spawn a similar entity?
    // Or is it just a health bonus?
  });
});
