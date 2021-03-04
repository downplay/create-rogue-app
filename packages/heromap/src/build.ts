import { RNG } from "herotext";
import { MapNode, OperationNode } from './types';

type VirtualGrid<T> = {

        width:number,
        height:number
,
    rows: T[][][]

    add(x: number,y:number,element:T) 


}



const executeOp = (map: MapNode, grid: VirtualGrid<>, op: OperationNode, rng:RNG) {
    switch (op.type) {
        case "Heromap::GlyphOperationNode":
            case "Heromap::MatchGroupNode":
    }
}  

const virtualGrid = <T>():VirtualGrid<T> => {
} 

export const build = (map: MapNode, rng: RNG) => {
  const width = Math.max(...map.map.map((line) => line.length));
  const height = map.map.length;
  const rows = map.map.slice();
  const grid = virtualGrid<GridElement>(width, height);
  for (const op of map.legend) {
    executeOp(map, grid, op, rng);
  }
  // TODO: Any other metadata?
  return {grid};
};
