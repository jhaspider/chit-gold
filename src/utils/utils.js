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
};

export default Utils;
