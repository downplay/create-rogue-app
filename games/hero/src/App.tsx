import React from "react";
import { RogueProvider, initializeState } from "./engine/RogueContext";
import { Global } from "./ui/Global";
import { Layout } from "./ui/Layout";
import { Game } from "./game/Game";
import { Player } from "./game/Player";

import "modern-css-reset/dist/reset.min.css";
import "./ui/Card.css";

const initialState = initializeState();

const App = () => {
  return (
    <RogueProvider initialState={initialState}>
      <Global />
      <Layout />
      <Game />
      <Player />
    </RogueProvider>
  );
};

export default App;
