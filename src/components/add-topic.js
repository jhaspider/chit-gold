import Utils from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import Events from "../utils/events";
import { AddTopic } from "../utils/save_chits";

function NewTopic(props) {
  let { close } = props;
  let topicName;

  const onSaveTap = (e) => {
    if (!topicName) {
      alert("Enter a topic name.");
      return;
    }
    topic.props = { id: uuidv4(), topicName };
    AddTopic(topic.props);
    close(topic);
  };

  const backgroundTap = (e) => {
    if (e.target.id === "bgcontainer") close(topic);
  };

  const onContentChangeHandler = (e) => (topicName = e.target.value.toUpperCase());

  const onKeyUpHandler = (e) => {
    if (e.code === "Enter") onSaveTap();
  };

  const getDom = () => {
    // Background
    const groupContainer = Utils.newElem("div", "bgcontainer", "add-group-container");
    groupContainer.addEventListener("click", backgroundTap);
    const addGroup = Utils.newElem("div", null, "add-group");
    groupContainer.append(addGroup);

    // Title
    const heading = Utils.newElem("h2", null, "title");
    heading.innerHTML = "Add Topic";
    addGroup.append(heading);

    // Body
    const topicName = Utils.newElem("input", "topic_name", "container");
    topicName.addEventListener("input", onContentChangeHandler);
    topicName.addEventListener("keyup", onKeyUpHandler);
    topicName.setAttribute("type", "text");
    addGroup.append(topicName);
    topicName.focus();

    // Archive
    const archivelink = Utils.newElem("a");
    archivelink.setAttribute("href", "javascript:void(0)");
    archivelink.innerHTML = "SAVE";
    archivelink.addEventListener("click", onSaveTap);
    addGroup.append(archivelink);

    return groupContainer;
  };

  const setFocus = () => topic.dom.querySelector("#topic_name").focus();

  const build = () => {
    const dom = getDom();
    return {
      dom,
      props: {},
      focus: setFocus,
    };
  };

  const topic = build();
  return topic;
}

function Topic({ topic, selectTopicHandler }) {
  const topicDom = Utils.newElem("a");
  topicDom.setAttribute("href", `#?topic_id=${topic.id}`);
  topicDom.innerHTML = topic.topicName;
  topicDom.dataset.id = topic.id;
  topicDom.addEventListener("click", selectTopicHandler);
  return topicDom;
}

export { NewTopic, Topic };
