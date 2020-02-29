import { CHAR_HEIGHT, CHAR_WIDTH } from "./Typography";
import styled from "styled-components";

export const Window = styled.div`
  border-style: double;
  border-width: ${CHAR_HEIGHT}px ${CHAR_WIDTH}px;
  margin: ${CHAR_HEIGHT}px ${CHAR_WIDTH}px;
`;
