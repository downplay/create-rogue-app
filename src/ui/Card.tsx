import React, { useRef, useState, useCallback, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { onCard } from "../engine/grid";
import { FONT_SIZE, CHAR_HEIGHT } from "./Typography";

const portalRoot = document.getElementById("card");

const CardWrapper = styled.div`
  background-color: black;
  margin: ${CHAR_HEIGHT / 2}px;
  padding: ${CHAR_HEIGHT / 2}px;
  border: solid 2px white;
`;

export const Description = styled.p`
  font-size: ${FONT_SIZE}px;
  line-height: ${CHAR_HEIGHT}px;
`;

const CardPortal = ({ children }: React.PropsWithChildren<{}>) => {
  const portalRef = useRef<HTMLDivElement>(document.createElement("div"));

  useLayoutEffect(() => {
    portalRoot?.appendChild(portalRef.current);
    // TODO: Technically this works even though if multiple cards are shown they are
    // all portalling into the same element; it'd be slightly more efficient to use a provider
    // so we're only setting the x/y position once, in practise this barely matters
    const mouseMove = (e: MouseEvent) => {
      portalRef.current.style.transform = `translate(${e.pageX}px, ${e.pageY}px)`;
    };
    window.addEventListener("mousemove", mouseMove);
    return () => {
      window.removeEventListener("mousemove", mouseMove);
      portalRef.current.remove();
    };
  }, []);

  return ReactDOM.createPortal(children, portalRef.current);
};

export const Card = ({ children }: React.PropsWithChildren<{}>) => {
  const [isVisible, setIsVisible] = useState(false);

  onCard(
    useCallback(() => {
      setIsVisible(true);
    }, []),
    useCallback(() => {
      setIsVisible(false);
    }, [])
  );

  if (isVisible) {
    return (
      <CardPortal>
        <CardWrapper>{children}</CardWrapper>
      </CardPortal>
    );
  }
  return null;
};
