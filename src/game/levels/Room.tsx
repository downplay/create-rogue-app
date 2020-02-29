import React ,{ useMemo }from "react";
import { Vector, vector } from '../../engine/vector';

type Props = {
  size: Vector;
};

export const Room = ({ size }: Props) => {
    const tiles = useMemo(() => {
        const tiles= []
        for (let x = 0;x<size.x;x++) {
            for (let y = 0;y<size.y;y++) {
                tiles.push(
                    x === 0 || y ===0 || x===size.x-1 || y===size.y-1 ? <Wall position={vector(x,y)}/> : <Floor position={vector(x,y)}/>
                )
            }
        }

};
