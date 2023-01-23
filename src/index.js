import Sheet from "./components/sheet";
import Toolbar from "./components/Toolbar";
import Topics from "./components/topics";
import Utils from "./utils/utils.js";

import "./firebase";
import { getAuth, signInAnonymously, onAuthStateChanged, connectAuthEmulator } from "firebase/auth";

const auth = getAuth();
if (process.env.NODE_ENV === "development") connectAuthEmulator(auth, "http://127.0.0.1:9099");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(user);
    localStorage.setItem("cheat-user-id", user.uid);
    loadApp();
  } else {
    signInAnonymously(auth)
      .then((user) => {})
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }
});

function loadApp() {
  const workarea = Utils.getDomById("workarea");
  workarea.append(Topics());
  workarea.append(Sheet());
  workarea.append(Toolbar());
}
