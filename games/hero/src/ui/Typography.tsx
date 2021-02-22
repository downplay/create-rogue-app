import React from "react";
import styled from "styled-components";
import "./fonts/noto/noto.css";
import "./fonts/fira/fira_code.css";

export const CHAR_WIDTH = 32;
export const CHAR_HEIGHT = 32;

export const FONT_SIZE = 26;

export const Line = styled.p`
  display: flex;
  width: 100%;
  line-height: ${CHAR_HEIGHT}px;
  font-size: ${FONT_SIZE}px;
  font-family: "Fira Code VF", fixed-width;
  font-variant-ligatures: contextual; // For the fun stuff
  margin: 0;
  padding: 0;
`;

export const Char = styled.span`
  width: ${CHAR_WIDTH}px;
  height: ${CHAR_HEIGHT}px;
  position: relative;
  color: #fff;
`;

type TwoToneProps = {
  fore: string;
  back: string;
};

const AsciiChar = styled.span<Omit<TwoToneProps, "back">>`
  position: absolute;
  display: block;
  font-size: ${FONT_SIZE}px;
  /* transform: scaleX(2.1);
  transform-origin: 0 0;
  top: -3px; */
  color: ${({ fore }) => fore};
`;

const AsciiWrap = styled.span<Omit<TwoToneProps, "fore">>`
  display: block;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: ${({ back }) => back};
`;

// glyph?
export const Ascii = ({
  back,
  ...props
}: React.PropsWithChildren<TwoToneProps>) => (
  <AsciiWrap back={back}>
    <AsciiChar {...props} />
  </AsciiWrap>
);

export const Emoji = styled.span`
  font-family: "Noto Emoji";
`;
