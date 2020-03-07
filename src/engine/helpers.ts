export const elements = <T>(count: number, factory: (n: number) => T): T[] => {
  var output = [];
  for (var n = 0; n < count; n++) {
    output.push(factory(n));
  }
  return output;
};
