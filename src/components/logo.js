import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();

  const logoTap = (e) => {
    navigate("/");
  };
  return (
    <div id="toolbar">
      <h1 id="title" onClick={logoTap}>
        ChitGold
      </h1>
    </div>
  );
};
export default Logo;
