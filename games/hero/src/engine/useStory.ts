// TODO: There's a case for this in `herotext-react` to just use a story without
// any game stuff (it'll look a bit like useEngine anyway just without player/game state)
// Will prob be used internally in useEngine eventually.

// import { useState, useRef } from "react";
// import { parse } from "herotext";
// import { ExecutionContext } from "./text/ExecutionContext";

// export const useStory = <S extends {}>(
//   initializer,
//   defaultState = {}
// ): [ExecutionResult, ExecutionContext] => {
//   // TODO: implement persistedState already
//   const [state, setState] = useState<S>(null!);
//   // Quite a cheap hack. Maybe need to use useEffect, but it's nice if the story
//   // runs straight away so state that gets set can be used immediately.
//   // If state changes do we re-run initializer? Need a system to record rng decisions?
//   const firstRef = useRef(false);
//   const mainRef = useRef<MainAST>();
//   if (!mainRef.current) {
//     firstRef.current = true;
//     mainRef.current = initializer();
//   }
//   const main = mainRef.current;
// };

export {};
