import React, { useEffect, useState } from "react";
import { useChitContext } from "../chit-provider";

const Error = () => {
  const { error, setError } = useChitContext();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  }, [error]);

  if (!error) return null;

  return <p className="api-error">{error}</p>;
};

export default Error;
