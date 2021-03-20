import { storyInstance, text } from "herotext";
import { TavernExterior } from "./TavernExterior";
import { TavernInterior } from "./TavernInterior";
import { encounter } from "../../../engine/encounter";

// export const TavernEncounter = encounter(() => {
//   const terminal = useTerminal();
//   const rng = useRng();
//   const encounter = useEntity();
//   // useRandomFactor(s) ?
//   const initialState = useMemo<TavernState>(() => {
//     const size = vector(rng.dice(4, 4) + 2, rng.dice(4, 4) + 2);
//     const door = vector(rng.integer(1, size.x - 1), size.y - 1);
//     return {
//       scene: TavernScene.Exterior,
//       type: rng.pick([TavernType.Brawl, TavernType.Rest]),
//       name: tavernNameText(rng),
//       size,
//       door,
//     };
//   }, []);

//   const [state, setState] = useEntityState(TavernStateKey, initialState);

//   // TODO: This is what a <Spawner> would look like (and then self-delete)
//   const find = useFindPosition(FLAG_ROADSIDE);
//   const game = useGame();
//   useEffect(() => {
//     game.enqueueTurn(0, encounter);
//   }, []);
//   onTurn(() => {
//     if (!state.spawn) {
//       const spawn = find();
//       if (spawn) {
//         console.log(spawn);
//         setState({
//           ...state,
//           spawn,
//         });
//       } else {
//         game.enqueueTurn(0.1, encounter);
//       }
//     }
//   });

//   switch (state.scene) {
//     case TavernScene.Exterior:
//       return (
//         <>
//           <RoadLayout />
//           <TavernExterior state={state} />
//         </>
//       );
//     case TavernScene.Interior:
//       return (
//         <>
//           <TavernInterior state={state} />
//         </>
//       );
//     default:
//       return null;
//   }
// });

export const TavernEncounter = encounter(text`
[$void($setup)
  You see a rustic-looking tavern. A creaking sign hanging by the door and swinging gently in the breeze reads: "$interior.Name"
]

setup:~
[
  $exterior=${storyInstance(TavernExterior)}
  $interior=${storyInstance(TavernInterior)}
  $interior.connect($exterior)
]
`);
