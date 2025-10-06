import React, { useEffect } from "react";

const CursorGlow: React.FC = () => {
  useEffect(() => {
    const shell = document.querySelector(".wiki-shell");
    if (!shell) return;

    const handleMouseMove = (e: MouseEvent) => {
      const glow = (shell as HTMLElement).style;
      glow.setProperty("--cursor-x", `${e.clientX}px`);
      glow.setProperty("--cursor-y", `${e.clientY}px`);
    };

    const handleMouseEnter = () => {
      const before = shell as HTMLElement;
      before.style.setProperty("--glow-opacity", "1");
    };

    const handleMouseLeave = () => {
      const before = shell as HTMLElement;
      before.style.setProperty("--glow-opacity", "0");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return null;
};

export default CursorGlow;
