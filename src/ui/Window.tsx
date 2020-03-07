import { CHAR_HEIGHT, CHAR_WIDTH } from "./Typography";
import styled from "styled-components";

export const Window = styled.div`
  overflow: hidden;
  border-style: double;
  border-width: ${CHAR_HEIGHT}px ${CHAR_WIDTH}px;
`;
