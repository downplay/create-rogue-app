import { render, MainAST } from "@hero/text";
import { useMemo } from "react";
import { useRng } from "./useRng";

// TODO: Probably also a candidate for `herotext-react`
export const useText = (
  text: MainAST,
  variables: Record<string, string> = {}
) => {
  const rng = useRng();
  // TODO: Needs caching at save file level
  return useMemo(() => {
    return render(text, rng, variables);
  }, [text]);
};
