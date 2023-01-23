import Events from "../utils/events";
import Utils from "../utils/utils";
import DevOnly from "./dev_only";
import ScaleComp from "./scale-comp";
import UserComp from "./user-comp";

function Toolbar() {
  const onAddChit = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_SELECT));

  const onAddTopic = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));

  const buildToolbar = () => {
    const toolbar_container = Utils.newElem("div", "toolbar-container");

    const upper_container = Utils.newElem("div", null, "upper-container");
    toolbar_container.append(upper_container);

    // Left
    const userComp = UserComp();
    upper_container.append(userComp.dom);

    // Middle
    const bottomToolbar = Utils.newElem("div", "bottom-toolbar");
    const btnAdd = Utils.newElem("button", null, "add-new-chit");
    btnAdd.addEventListener("click", onAddChit);
    bottomToolbar.append(btnAdd);

    const btnTopic = Utils.newElem("button", null, "add-new-topic");
    btnTopic.addEventListener("click", onAddTopic);
    bottomToolbar.append(btnTopic);

    const scaleComp = ScaleComp();
    bottomToolbar.append(scaleComp.dom);
    upper_container.append(bottomToolbar);

    // Right
    const wrapper = Utils.newElem("div", null, "tool-topic");
    const dom = Utils.newElem("h2", "topic-label");
    dom.innerHTML = "Hello";
    wrapper.append(dom);
    upper_container.append(wrapper);

    toolbar_container.append(DevOnly());

    return toolbar_container;
  };

  const onTopicSelect = (e) => {
    const topic = e.detail.topic;
    container.querySelector("#topic-label").innerHTML = topic.topicName;
  };

  const container = buildToolbar();

  document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);
  return container;
}

export default Toolbar;
