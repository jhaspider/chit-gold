import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChitContext } from "../chit-provider";

const Logo = () => {
  const navigate = useNavigate();
  const { user } = useChitContext();
  const logoTap = (e) => {
    if (user.isAnonymous) navigate("/");
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
