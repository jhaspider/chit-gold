import "../firebase";
import { getAuth } from "firebase/auth";
const Utils = {
  getDomById: (id) => {
    return document.getElementById(id);
  },

  newElem: (type, id = null, style = null) => {
    const dom = document.createElement(type);
    if (id) dom.setAttribute("id", id);
    if (style) dom.classList.add(style);
    return dom;
  },

  blink: (blinkElement) => {
    blinkElement.classList.add("blink");

    setTimeout(() => {
      blinkElement.classList.remove("blink");
      blinkElement.style.display = "none";
    }, 2100);
  },

  getUId: () => {
    const auth = getAuth();
    return auth.currentUser;
  },

  capitalize: (string) => {
    if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  },
};

export default Utils;
