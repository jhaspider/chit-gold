import React, { useEffect, useState } from "react";
import * as ReactDOM from "react-dom/client";

import "./firebase";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import ChitRouter from "./chit-router";
import ChitProvider from "./chit-provider";

const auth = getAuth();
if (process.env.NODE_ENV === "development") connectAuthEmulator(auth, "http://127.0.0.1:9099");

const root = ReactDOM.createRoot(document.getElementById("workarea"));
root.render(
  <ChitProvider>
    <ChitRouter />
  </ChitProvider>
);
