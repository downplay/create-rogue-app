import { useRng } from "./useRng";

export const useText = (text: ParsedText) => {
  const rng = useRng();

  const result = null;

  return [output, state];
};

useMemo(() => {
  const parsed = text`
(*$tavernName* welcomes
careful drunks)
(Menu
- Beer
- Beer
- Beer!)
(😁 Happy Hour!
All day long!!)
`;

  return parsed(rng, { tavernName });
}, []);
