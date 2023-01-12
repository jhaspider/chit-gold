import Events from "../utils/events";
import Utils from "../utils/utils";

function Toolbar() {
  const onAddChit = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_SELECT));

  const onAddTopic = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));

  const buildToolbar = () => {
    const bottomToolbar = Utils.newElem("div", "bottom-toolbar");

    const btnAdd = Utils.newElem("button", null, "add-new-chit");
    btnAdd.addEventListener("click", onAddChit);
    bottomToolbar.append(btnAdd);

    const btnTopic = Utils.newElem("button", null, "add-new-topic");
    btnTopic.addEventListener("click", onAddTopic);
    bottomToolbar.append(btnTopic);
    return bottomToolbar;
  };

  const container = buildToolbar();

  return container;
}

export default Toolbar;
