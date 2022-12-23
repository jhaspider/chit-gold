import Events from "../utils/events";
import { LoadTopics } from "../utils/save_chits";
import Utils from "../utils/utils";
import AddGroup from "./add-group";

function Topics() {
  const all_topics = [];
  const removeGroupHandler = (topic) => {
    if (topic.props.id) renderTopics();
    document.body.removeChild(topic.dom);
  };

  const addGroupHandler = (e) => {
    const addGroup = AddGroup({ close: removeGroupHandler });
    document.body.append(addGroup.dom);
  };

  const selectTopicHandler = (e) => {
    document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { id: e.target.dataset.id } }));
  };

  const renderTopics = () => {
    const topicDom = (topic) => {
      const topicDom = Utils.newElem("a");
      topicDom.setAttribute("href", "javascript:void(0)");
      topicDom.innerHTML = topic.topicName;
      topicDom.dataset.id = topic.id;
      topicDom.addEventListener("click", selectTopicHandler);
      return topicDom;
    };

    const topics = LoadTopics();
    if (topics.length <= 0) addGroupHandler();
    else {
      var parentNode = container.querySelector("#topics-list");
      all_topics.forEach((t) => {
        parentNode.removeChild(t);
      });
      all_topics.splice(0, all_topics.length);

      topics.forEach((topic) => {
        const t = topicDom(topic);
        all_topics.push(t);
        parentNode.append(t);
      });

      setTimeout(() => {
        document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { id: topics[topics.length - 1].id } }));
      }, 1000);
    }
  };

  const buildTopicDom = () => {
    const topicsDom = Utils.newElem("div", null, "chit-archive");

    const topicsList = Utils.newElem("div", "topics-list");
    topicsDom.append(topicsList);

    const addTopicLink = Utils.newElem("a");
    addTopicLink.setAttribute("href", "javascript:void(0)");
    addTopicLink.innerHTML = "ADD TOPIC";
    addTopicLink.addEventListener("click", addGroupHandler);
    topicsDom.append(addTopicLink);

    return topicsDom;
  };

  const container = buildTopicDom();
  renderTopics();
  return container;
}

export default Topics;
