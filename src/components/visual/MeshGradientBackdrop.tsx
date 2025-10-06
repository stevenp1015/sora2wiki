import React from "react";

const MeshGradientBackdrop: React.FC = () => (
  <div className="mesh-backdrop" aria-hidden>
    <div className="mesh-backdrop__layer mesh-backdrop__layer--primary" />
    <div className="mesh-backdrop__layer mesh-backdrop__layer--secondary" />
    <div className="mesh-backdrop__noise" />
  </div>
);

export default MeshGradientBackdrop;
