import { Global } from "./ui/Global";
import { Layout } from "./ui/Layout";
// import { Player } from "./game/Player";

import "modern-css-reset/dist/reset.min.css";
import "./ui/Card.css";
import { Providers } from "./providers/Providers";
import { entities } from "./game/entities";
import { useEngine } from "./engine/engine";
import { useRng } from "./engine/useRng";

const App = () => {
  const rng = useRng();
  const engine = useEngine({ entities, rng });
  return (
    <Providers>
      <Global />
      <Layout {...engine} />
      {/* <Game /> */}
      {/* <Player /> */}
    </Providers>
  );
};

export default App;
