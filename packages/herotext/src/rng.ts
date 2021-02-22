const repeat = <T>(count: number, factory: (n: number) => T): T[] => {
  const output = [];
  for (let n = 0; n < count; n++) {
    output.push(factory(n));
  }
  return output;
};

const sum = (values: number[]) => values.reduce((total, n) => total + n, 0);

export type RNG = {
  raw: () => number;
  range: (min: number, max: number) => number;
  integer: (min: number, max: number) => number;
  pick: <T>(items: T[]) => T;
  dice: (count: number, sides: number) => number;
  // text: (input: TemplateStringsArray) => string;
};

export const buildRng = (getter: () => number = () => Math.random()): RNG => {
  const integer = (min: number, max: number) =>
    Math.floor(getter() * (max - min) + min);

  const rng = {
    raw: getter,
    range: (min: number, max: number) => getter() * (max - min) + min,
    integer,
    pick: <T>(items: T[]) => items[integer(0, items.length)],
    dice: (count: number, sides: number) =>
      sum(repeat(count, () => integer(1, sides))),
    // TODO: Not quite sure what the intention was here, leaving for now
    // text: (input: TemplateStringsArray | ParsedText) => {
    //   if (Array.isArray(input)) {
    //     const flattened = input
    //       .map((value) => {
    //         return value;
    //       })
    //       .join("");
    //     const parsed = parse(flattened);
    //     return parsed(rng);
    //   }
    //   return (input as ParsedText)(rng);
    // },
  };
  return rng;
};
