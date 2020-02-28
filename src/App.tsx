import React, { useState } from "react";
import { RogueProvider, initializeState } from "./game/RogueContext";

const App = () => {
  // TODO: This stuff goes in a useEngine hook
  const [state, setState] = useState(() => initializeState());

  return (
    <RogueProvider state={state}>
      <Layout></Layout>
    </RogueProvider>
  );
};

export default App;
