import React from "react";
import styled from "styled-components";
import { Char } from "../Typography";
import { elements } from "../../engine/helpers";

type BarProps = {
  length: number;
  color: string;
};

type MeterProps = {
  total?: number;
  value: number;
  size?: number;
  fore: string;
  back: string;
};

const ColorChar = styled(Char)<Pick<BarProps, "color">>`
  color: ${({ color }) => color};
`;

const Bar = ({ length, color }: BarProps) => (
  <ColorChar color={color}>{elements(length, () => "\u2550")}</ColorChar>
);

export const Meter = ({ total, value, fore, back, size = 10 }: MeterProps) => {
  const length =
    total === undefined ? size : Math.floor((value / total) * size);
  console.log(total);
  return (
    <>
      <Bar length={length} color={fore} />
      <Bar length={size - length} color={back} />
    </>
  );
};
