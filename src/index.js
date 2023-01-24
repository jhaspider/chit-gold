import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider, Route, Link } from "react-router-dom";

import Sheet from "./components/sheet";
import Toolbar from "./components/Toolbar";
import Topics from "./components/topics";

import "./firebase";
import { getAuth, signInAnonymously, onAuthStateChanged, connectAuthEmulator, getRedirectResult, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import PublicPage from "./components/public-page";
import Logo from "./components/logo";

const auth = getAuth();

if (process.env.NODE_ENV === "development") connectAuthEmulator(auth, "http://127.0.0.1:9099");

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth)
          .then((user) => {})
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
      }
    });
  }, []);

  if (!user) return null;
  return (
    <>
      <Logo />
      <Topics />
      <Sheet />
      <Toolbar />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicPage />,
  },
  {
    path: "/console/topic/:topic_id",
    element: <App />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("workarea"));
root.render(<RouterProvider router={router} />);
