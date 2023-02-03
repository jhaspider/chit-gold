import React from "react";
import { getAuth } from "firebase/auth";
import "../firebase";

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
