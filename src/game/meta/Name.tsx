import React, { useEffect } from "react";
import styled from "styled-components";
import { hasName } from "../../engine/hasName";
import { FONT_SIZE, CHAR_HEIGHT } from "../../ui/Typography";

type NameProps = {
  children: string;
};

export const NameHeader = styled.h1`
  font-size: ${FONT_SIZE}px;
  line-height: ${CHAR_HEIGHT}px;
`;

export const Name = ({ children }: NameProps) => {
  hasName(children);
  return <NameHeader>{children}</NameHeader>;
};
