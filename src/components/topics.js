import Events from "../utils/events";
import { LoadTopics } from "../utils/save_chits";
import Utils from "../utils/utils";
import { NewTopic, Topic } from "./add-topic";

function Topics() {
  const all_topics = [];
  const removeGroupHandler = (topic) => {
    if (topic.props.id) renderTopics();
    document.body.removeChild(topic.dom);
  };

  const addNewTopicHandler = (e) => {
    const newTopic = NewTopic({ close: removeGroupHandler });

    document.body.append(newTopic.dom);
    newTopic.focus();
  };

  const selectTopicHandler = (e) => {
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT));
    }, 200);
  };

  const renderTopics = () => {
    const topics = LoadTopics();
    if (topics.length > 0) {
      var parentNode = container.querySelector("#topics-list");
      all_topics.forEach((t) => {
        parentNode.removeChild(t);
      });
      all_topics.splice(0, all_topics.length);

      topics.forEach((topic, tindex) => {
        const t = Topic({ topic, selectTopicHandler });
        all_topics.push(t);
        parentNode.append(t);

        if (tindex == topics.length - 1) {
          const queryString = window.location.hash;
          const topicId = queryString.split("=")[1];
          if (!topicId) {
            console.log(`Latest Topic Id : ${topic.id}`);
            t.click();
          }
        }
      });
    }
  };

  const buildTopicDom = () => {
    const topicsDom = Utils.newElem("div", null, "chit-archive");

    const topicsList = Utils.newElem("div", "topics-list");
    topicsDom.append(topicsList);

    const addTopicLink = Utils.newElem("a");
    addTopicLink.setAttribute("href", "javascript:void(0)");
    addTopicLink.innerHTML = "ADD TOPIC";
    addTopicLink.addEventListener("click", addNewTopicHandler);
    topicsDom.append(addTopicLink);

    return topicsDom;
  };

  const container = buildTopicDom();
  renderTopics();
  if (all_topics.length <= 0) addNewTopicHandler();
  return container;
}

export default Topics;
