import React from "react";
import { RogueProvider, initializeState } from "./engine/RogueContext";
import { Layout } from "./ui/Layout";

const initialState = initializeState();

const App = () => {
  return (
    <RogueProvider initialState={initialState}>
      <Layout />
    </RogueProvider>
  );
};

export default App;
