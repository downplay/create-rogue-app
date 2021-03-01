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
  pick: <T>(items: T[], weightProp?: string | ((item: T) => number)) => T;
  dice: (count: number, sides: number) => number;
  // text: (input: TemplateStringsArray) => string;
};

// TODO: Could probably specify that T must have weightProp
const pickWeighted = <T>(
  items: T[],
  weightProp: string | ((item: T) => number),
  value: number
) => {
  let total = 0;
  const weight =
    typeof weightProp === "string"
      ? (item: any) => item[weightProp]
      : weightProp;
  for (const item of items) {
    total += weight(item) as number;
  }
  const target = value * total;
  let running = 0;
  for (const item of items) {
    running += weight(item) as number;
    if (running > target) {
      return item;
    }
  }
  // TODO: Not always expected behaviour ... it's a short-term hack for switch-style
  // lists where the final one is default if none match
  return items[items.length - 1];
};

export const createRng = (getter: () => number = () => Math.random()): RNG => {
  const integer = (min: number, max: number) =>
    Math.floor(getter() * (max - min) + min);

  const rng = {
    raw: getter,
    range: (min: number, max: number) => getter() * (max - min) + min,
    integer,
    pick: <T>(items: T[], weightProp?: string | ((item: T) => number)) =>
      weightProp
        ? pickWeighted(items, weightProp, getter())
        : items[integer(0, items.length)],
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
