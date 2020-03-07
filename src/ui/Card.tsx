import React, { useRef, useState, useCallback, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { onCard } from "../engine/grid";

const portalRoot = document.getElementById("card");

const CardPortal = ({ children }: React.PropsWithChildren<{}>) => {
  const portalRef = useRef<HTMLDivElement>(document.createElement("div"));

  useLayoutEffect(() => {
    portalRoot?.appendChild(portalRef.current);
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
    return <CardPortal>{children}</CardPortal>;
  }
  return null;
};
