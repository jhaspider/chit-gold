import "../firebase";
import { getAuth } from "firebase/auth";
import Utils from "../utils/utils";

const auth = getAuth();

function DevOnly() {
  const clearLocalData = () => {
    localStorage.clear();
    sessionStorage.clear();
    auth.signOut();
    window.location = "/";
  };

  const flushSettings = (e) => {
    e.preventDefault();
    console.log(e);
    clearLocalData();
  };

  const buildDom = () => {
    const container = Utils.newElem("div", null, "dev-only");

    const link = Utils.newElem("a");
    link.setAttribute("href", "javascript:void(0)");
    link.innerHTML = "Flush Local Settings";
    link.addEventListener("click", flushSettings);
    container.append(link);
    return container;
  };

  if (process.env.NODE_ENV === "development") return buildDom();
  else return null;
}

export default DevOnly;
