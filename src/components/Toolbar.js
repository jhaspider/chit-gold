import Events from "../utils/events";
import Utils from "../utils/utils";

function Toolbar() {
  const onAddChit = (e) => {
    document.dispatchEvent(new CustomEvent(Events.BTN_ADD_SELECT));
  };
  const buildToolbar = () => {
    const bottomToolbar = Utils.newElem("div", "bottom-toolbar");

    const btnAdd = Utils.newElem("button", null, "add-new");
    btnAdd.addEventListener("click", onAddChit);
    bottomToolbar.append(btnAdd);
    return bottomToolbar;
  };

  const container = buildToolbar();

  return container;
}

export default Toolbar;
