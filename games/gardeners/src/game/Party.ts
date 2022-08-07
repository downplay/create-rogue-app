type ChipData = {
  type: string;
  entity: Entity<ChipEntityExternal>;
};

type PartyData = {
  stack: ChipData[];
};

const Party = defineEntity(() => {
  const [data, updateData] = hasData("Party", () => ({ stack: [] }));
  onCreate(() => {});
});
