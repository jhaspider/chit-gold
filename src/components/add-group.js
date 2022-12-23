import Utils from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import Events from "../utils/events";
import { AddTopic } from "../utils/save_chits";

function AddGroup(props) {
  let { close } = props;
  let topicName;

  const onSaveTap = (e) => {
    if (!topicName) {
      alert("Enter a topic name.");
      return;
    }
    AddTopic({ id: uuidv4(), topicName });
    close(topic);
  };

  const backgroundTap = (e) => {
    if (e.target.id === "bgcontainer") close(topic);
  };

  const onContentChangeHandler = (e) => (topicName = e.target.value);

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
    const topicName = Utils.newElem("input", null, "container");
    topicName.addEventListener("input", onContentChangeHandler);
    topicName.addEventListener("keyup", onKeyUpHandler);
    topicName.setAttribute("type", "text");
    addGroup.append(topicName);

    // Archive
    const cellarchive = Utils.newElem("div", null, "action");
    cellarchive.addEventListener("click", onSaveTap);
    addGroup.append(cellarchive);

    const archivelink = Utils.newElem("a");
    archivelink.setAttribute("href", "#");
    archivelink.innerHTML = "SAVE";
    cellarchive.append(archivelink);

    return groupContainer;
  };

  const build = () => {
    const dom = getDom();
    return {
      dom,
      props: {},
    };
  };

  const topic = build();
  return topic;
}

export default AddGroup;
