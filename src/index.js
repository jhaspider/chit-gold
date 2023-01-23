import React, { useState } from "react";
import * as ReactDOM from "react-dom/client";

import Sheet from "./components/sheet";
import Toolbar from "./components/Toolbar";
import Topics from "./components/topics";
import Utils from "./utils/utils.js";

import "./firebase";
import { getAuth, signInAnonymously, onAuthStateChanged, connectAuthEmulator, getRedirectResult, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import Events from "./utils/events";

const auth = getAuth();

if (process.env.NODE_ENV === "development") connectAuthEmulator(auth, "http://127.0.0.1:9099");

// const workarea = Utils.getDomById("workarea");
// workarea.append(Topics());
// workarea.append(Sheet());
// workarea.append(Toolbar());

function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      // document.dispatchEvent(new CustomEvent(Events.USER_LOGGED_IN, { detail: { user } }));
    } else {
      signInAnonymously(auth)
        .then((user) => {})
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    }
  });

  if (!user) return null;
  return (
    <>
      <Topics />
      <Sheet />
      <Toolbar />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("workarea"));
root.render(<App />);
