import { CHAR_HEIGHT, CHAR_WIDTH } from "./Typography";
import styled from "styled-components";

export const Window = styled.div`
  /* overflow: hidden; */
  position: relative;
  border-style: double;
  border-width: ${CHAR_HEIGHT}px ${CHAR_WIDTH}px;
`;

type WindowProps = {
  name: string
}

export const Window = ({}) => {

}