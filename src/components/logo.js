import React from "react";
import { useNavigate } from "react-router-dom";
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
      <p>Beta</p>
    </div>
  );
};
export default Logo;
