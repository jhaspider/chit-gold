import React, { useEffect, useState } from "react";
import { useChitContext } from "../chit-provider";

import Logo from "./logo";
import Sheet from "./sheet";
import Toolbar from "./Toolbar";
import Topics from "./topics";

function App() {
  const { user } = useChitContext();
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

export default App;
