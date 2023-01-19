import Utils from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import Events from "../utils/events";
import { AddTopic } from "../utils/save_chits";

function NewTopic(props) {
  let { close } = props;
  let topicName;

  const onSaveTap = async (e) => {
    if (!topicName) {
      alert("Enter a topic name.");
      return;
    }

    const newTopic = { topicName, scale: 1 };
    const id = await AddTopic(newTopic);
    close({ ...newTopic, id });
  };

  const backgroundTap = (e) => {
    if (e.target.id === "bgcontainer") close();
  };

  const onContentChangeHandler = (e) => {
    topicName = e.target.value.toUpperCase();
    if (topicName.length > 2) {
      const pPrompt = document.querySelector("#enter-prompt");
      pPrompt.innerHTML = `Hit "Enter" to save`;
      Utils.blink(document.querySelector("#enter-prompt"));
    }
  };

  const onKeyUpHandler = (e) => {
    if (e.code === "Enter") onSaveTap();
  };

  const getDom = () => {
    // Background
    const groupContainer = Utils.newElem("div", "bgcontainer", "add-group-container");
    groupContainer.addEventListener("click", backgroundTap);
    const addGroup = Utils.newElem("div", null, "add-group");
    groupContainer.append(addGroup);

    // Body
    const topicName = Utils.newElem("input", "topic_name", "container");
    topicName.addEventListener("input", onContentChangeHandler);
    topicName.addEventListener("keyup", onKeyUpHandler);
    topicName.setAttribute("type", "text");
    topicName.setAttribute("placeholder", "Add a Topic");
    topicName.setAttribute("autocomplete", "off");
    addGroup.append(topicName);

    // Archive
    const archivelink = Utils.newElem("p", "enter-prompt");
    addGroup.append(archivelink);

    return groupContainer;
  };

  return { dom: getDom(), props: {} };
}

const NewTopicMgmt = (props) => {
  const topic = NewTopic(props);
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && node.classList.contains("add-group-container")) {
          node.querySelector("#topic_name").focus();
        }
      });
    });
  });

  observer.observe(document.body, { childList: true });
  return topic;
};

export default NewTopicMgmt;
