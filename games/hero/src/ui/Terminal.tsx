import React, { useRef, useLayoutEffect } from "react";
import { Line } from "./Typography";
import { useTerminalState } from "../engine/terminal";
import styled from "styled-components";

const Scroller = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export const Terminal = () => {
  const scrollRef = useRef<HTMLDivElement>(null!);
  const terminal = useTerminalState();
  // Scroll to bottom on new message
  useLayoutEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [terminal.messages]);
  return (
    <Scroller ref={scrollRef}>
      {terminal.messages.map((text, index) => (
        <Line key={index}>{text}</Line>
      ))}
    </Scroller>
  );
};