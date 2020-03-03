import styled from "styled-components";
import "./fonts/fira/fira_code.css";

export const CHAR_WIDTH = 12;
export const CHAR_HEIGHT = 22;

export const Line = styled.p`
  position: relative;
  display: flex;
  width: 100%;
  font-size: 18px;
  font-family: "Fira Code VF", fixed-width;
  height: ${CHAR_HEIGHT}px;
`;

export const Char = styled.span`
  width: ${CHAR_WIDTH}px;
  height: ${CHAR_HEIGHT}px;
  position: relative;
  color: #fff;
`;
