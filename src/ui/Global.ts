import { createGlobalStyle } from "styled-components";
import { CHAR_WIDTH } from "./Typography";

export const Global = createGlobalStyle`
  body {
    font-size: ${CHAR_WIDTH}px;
    font-family: "Fira Code VF", monospace;
    background-color: #000;
    color: #fff;
  }
`;
