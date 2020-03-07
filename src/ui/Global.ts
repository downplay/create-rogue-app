import { createGlobalStyle } from "styled-components";
import { CHAR_WIDTH } from "./Typography";

export const Global = createGlobalStyle`
  html, body, #root {
    position: relative;
    width: 100%;
    height: 100%;
  }
  body {
    font-size: ${CHAR_WIDTH}px;
    font-family: "Fira Code VF", monospace;
    background-color: #000;
    color: #fff;
  }
`;
