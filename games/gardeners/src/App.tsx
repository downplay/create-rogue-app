import { Global } from "./ui/Global";
import { Layout } from "./ui/Layout";

import "modern-css-reset/dist/reset.min.css";
import "./ui/Card.css";
import { Providers } from "./providers/Providers";
import { useEngine } from "./hooks/useEngine";
import { useRng } from "./hooks/useRng";
import { Game } from "./game/Game";

const App = () => {
  const rng = useRng();
  const engine = useEngine({ rng, game: Game });
  return (
    <Providers>
      <Global />
      <Layout engine={engine} />
    </Providers>
  );
};

export default App;
