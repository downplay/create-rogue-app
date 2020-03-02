import React from "react";
import { RogueProvider, initializeState } from "./engine/RogueContext";
import { Global } from "./ui/Global";
import { Layout } from "./ui/Layout";
import { Game } from "./game/Game";

import "modern-css-reset/dist/reset.min.css";

const initialState = initializeState();

const App = () => {
  return (
    <RogueProvider initialState={initialState}>
      <Global />
      <Layout />
      <Game />
    </RogueProvider>
  );
};

export default App;
