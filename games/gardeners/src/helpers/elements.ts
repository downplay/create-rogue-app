export const elements = <T>(count: number, factory: (n: number) => T): T[] => {
  const output = [];
  for (let n = 0; n < count; n++) {
    output.push(factory(n));
  }
  return output;
};

export const omitUndefined = <T>(input: (T | undefined)[]): T[] =>
  input.filter((value) => value !== undefined) as T[];
