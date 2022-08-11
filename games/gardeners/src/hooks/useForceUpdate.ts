import { useState, useCallback } from "react";

export const useForceUpdate = () => {
  const [, setState] = useState(0);
  return useCallback(() => {
    setState((count) => count + 1);
  }, []);
};
