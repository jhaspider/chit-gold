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

  blink: (blinkElement) => blinkElement.classList.add("blink"),

  getUId: () => {
    const uid = localStorage.getItem("cheat-user-id");
    return uid;
  },
};

export default Utils;
