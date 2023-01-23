import React from "react";
import "../firebase";
import { getAuth } from "firebase/auth";
import Utils from "../utils/utils";

const auth = getAuth();

function DevOnly() {
  const clearLocalData = () => {
    auth.signOut();
    window.location = "/";
  };

  const flushSettings = (e) => {
    e.preventDefault();
    clearLocalData();
  };

  if (process.env.NODE_ENV === "development")
    return (
      <div className="dev-only">
        <a href="" onClick={flushSettings}>
          Flush Local Settings
        </a>
      </div>
    );
  else return null;
}

export default DevOnly;
