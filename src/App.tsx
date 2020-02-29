import React, { useState } from "react";
import { RogueProvider, initializeState } from "./engine/RogueContext";
import { Layout } from "./ui/Layout";

const App = () => {
  // TODO: This stuff goes in a useEngine hook
  const [state, setState] = useState(() => initializeState());

  return (
    <RogueProvider state={state}>
      <Layout />
    </RogueProvider>
  );
};

export default App;
