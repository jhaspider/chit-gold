import React from "react";
import * as ReactDOM from "react-dom/client";

import { connectAuthEmulator, getAuth } from "firebase/auth";
import ChitProvider from "./chit-provider";
import ChitRouter from "./chit-router";
import Error from "./components/error";
import Spinner from "./components/spinner";
import "./firebase";
import "./index.css";

const auth = getAuth();
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") connectAuthEmulator(auth, "http://127.0.0.1:9099");

document.documentElement.style.setProperty("--random", Math.floor(Math.random() * 360));

const root = ReactDOM.createRoot(document.getElementById("workarea"));
root.render(
  <ChitProvider>
    <>
      <ChitRouter />
      <Spinner />
      <Error />
    </>
  </ChitProvider>
);
