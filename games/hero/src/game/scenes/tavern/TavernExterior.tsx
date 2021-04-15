import { exterior1 } from "./maps";
import { RoadLayout } from "../../biomes/plains/RoadLayout";
import { text } from "herotext";

// export const TavernEntrance = ({ ...rest }: PositionProps) => {
//   const [state, setState] = useEntityState<TavernState>(TavernStateKey);

//   const handleEnterInterior = useCallback(() => {
//     setState({
//       ...state,
//       scene: TavernScene.Interior,
//     });
//   }, [state]);

//   return <Door {...rest} onEnter={handleEnterInterior} />;
// };

// type Props = {
//   state: TavernState;
// };

export const TavernExterior = text`
$map(${RoadLayout})
$map(${exterior1})
`;

// ({ state }: Props) => {
//   const [doors, origin, signPosition] = useMemo(
//     () =>
//       state.spawn
//         ? [
//             [state.door],
//             subtract(state.spawn, state.door),
//             add(state.spawn, vector(1, 1)),
//           ]
//         : [],
//     [state.door, state.spawn]
//   );
//   return state.spawn ? (
//     <Room
//       size={state.size}
//       origin={origin}
//       DoorComponent={TavernEntrance}
//       FloorComponent={Roof}
//       doors={doors}
//     >
//       <Sign tavernName={state.name} position={signPosition!} />
//     </Room>
//   ) : null;
// };
