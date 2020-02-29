import styled from "styled-components";
import "./fonts/fira/fira_code.css";

export const CHAR_WIDTH = 40;
export const CHAR_HEIGHT = 60;

export const Line = styled.p`
  position: relative;
  display: flex;
  width: 100%;
  font-size: ${CHAR_WIDTH}px;
  font-family: "Fira Code VF", fixed-width;
  height: ${CHAR_HEIGHT}px;
`;

export const Char = styled.span`
  width: ${CHAR_WIDTH}px;
  height: ${CHAR_HEIGHT}px;
  position: relative;
  color: #fff;
`;
