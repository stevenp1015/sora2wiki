import React, { useEffect, useState } from "react";

const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div
      className="reading-progress"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 1000,
        pointerEvents: "none",
      }}
    >
      <div
        className="reading-progress__bar"
        style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #7c5cff, #00d9ff)",
          boxShadow: `0 0 16px rgba(124, 92, 255, ${progress > 0 ? 0.6 : 0})`,
          transition: "width 0.15s ease-out, box-shadow 0.3s ease",
        }}
      />
    </div>
  );
};

export default ReadingProgress;
