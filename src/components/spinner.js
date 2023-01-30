import React from "react";
import { useChitContext } from "../chit-provider";

const Spinner = () => {
  const { spinner } = useChitContext();

  if (!spinner) return null;
  return (
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
};

export default Spinner;
