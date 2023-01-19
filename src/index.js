import Sheet from "./components/sheet";
import Toolbar from "./components/Toolbar";
import Topics from "./components/topics";
import Utils from "./utils/utils.js";

import "./firebase";
import { getAuth, signInAnonymously, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";

const auth = getAuth();
connectAuthEmulator(auth, "http://127.0.0.1:9099");

onAuthStateChanged(auth, (user) => {
  if (user) {
    localStorage.setItem("cheat-user-id", user.uid);
    loadApp(user);
  } else {
    signInAnonymously(auth)
      .then((user) => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
});

function loadApp(user) {
  const workarea = Utils.getDomById("workarea");
  workarea.append(Topics());
  workarea.append(Sheet());
  workarea.append(Toolbar());
}
