import { RogueProvider, initializeState } from "./engine/RogueContext";
import { Global } from "./ui/Global";
import { Layout } from "./ui/Layout";
import { Game } from "./game/Game";
// import { Player } from "./game/Player";

import "modern-css-reset/dist/reset.min.css";
import "./ui/Card.css";
import { Providers } from "./providers/Providers";
import { useGame } from "./engine/game";

const initialState = initializeState();

const App = () => {
  const { game, player, map } = useGame()
  return (
    <RogueProvider initialState={initialState}>
      <Providers>
        <Global />
        <Layout />
        {/* <Game /> */}
        {/* <Player /> */}
      </Providers>
    </RogueProvider>
  );
};

export default App;
