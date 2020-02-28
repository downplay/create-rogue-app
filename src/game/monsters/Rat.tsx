import { useTile } from "../../engine/useTile";

const RatTile = () => "🐀";

export const Rat = entity(() => {
  useTile(RatTile);
  const stats = useStats();

  return (
    <Monster>
      <Name>Rat</Name>
      <Description></Description>
    </Monster>
  );
});
