import { useRef, useLayoutEffect } from "react";
import { ExecutionResultItem, stringifyResult } from "@hero/text";
import styled from "styled-components";
import { Line } from "./Typography";
import { HeroEngine } from "../engine/types";

const Scroller = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

export type TerminalContent = ExecutionResultItem[];

type Props = {
  engine: HeroEngine;
  content: TerminalContent;
};

const aggregateContent = (content: TerminalContent) => {
  const aggregated = [];
  for (let i = 0; i < content.length; i++) {
    // TODO: aggregate properly
    aggregated.push(<Line key={i}>{stringifyResult([content[i]])}</Line>);
  }
  return aggregated;
};

export const Terminal = ({ content, engine }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null!);
  // Scroll to bottom on new message
  useLayoutEffect(() => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [content]);
  // TODO: Memoize content
  return <Scroller ref={scrollRef}>{aggregateContent(content)}</Scroller>;
};
