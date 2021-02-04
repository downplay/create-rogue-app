import { useMemo } from "react";
import { useRng } from "./useRng";
import { ParsedTextTemplate } from "./text/parse";

export const useText = (
  text: ParsedTextTemplate,
  variables: Record<string, string> = {}
) => {
  const rng = useRng();
  // TODO: Needs caching at save file level
  return useMemo(() => {
    return text.render(rng, variables);
  }, [text]);
};
