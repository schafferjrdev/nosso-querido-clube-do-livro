import React from "react";
import "./App.less";

const Card = ({ title, extra, children }) => {
  return (
    <div className="card">
      <div className="head">
        <span className="title">{title}</span>
        <span className="extra">{extra}</span>
      </div>
      <div className="child">{children}</div>
    </div>
  );
};

export default Card;
