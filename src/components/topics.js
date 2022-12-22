import Utils from "../utils/utils";
import AddGroup from "./add-group";
function Topics() {
  const removeGroupHandler = (topic) => {
    console.log(`close called`, topic.dom);
    document.body.removeChild(topic.dom);
  };
  const addGroupHandler = (e) => {
    const addGroup = AddGroup({ close: removeGroupHandler });

    document.body.append(addGroup.dom);
  };

  const buildTopicDom = () => {
    const topicsDom = Utils.newElem("div", null, "chit-archive");

    const addTopicLink = Utils.newElem("a");
    addTopicLink.setAttribute("href", "javascript:void(0)");
    addTopicLink.innerHTML = "ADD TOPIC";
    addTopicLink.addEventListener("click", addGroupHandler);
    topicsDom.append(addTopicLink);

    return topicsDom;
  };

  const container = buildTopicDom();
  return container;
}

export default Topics;
