import Events from "../utils/events";
import { LoadTopics } from "../utils/save_chits";
import Utils from "../utils/utils";

function Topic({ topic, selectTopicHandler }) {
  const topicDom = Utils.newElem("a");
  topicDom.innerHTML = topic.topicName;

  const li = Utils.newElem("li", null, "topic-items");
  li.addEventListener("click", selectTopicHandler);
  li.dataset.id = topic.id;
  li.append(topicDom);
  return li;
}

function Topics(props) {
  const all_topics = [];
  let { topicId } = props;

  const selectTopicHandler = (e) => {
    topicId = e.currentTarget.dataset.id;
    loadTopicChits();
  };

  const loadTopicChits = () => {
    if (topicId) {
      history.pushState(null, null, `#?topic_id=${topicId}`);
      setTimeout(() => document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { topicId } })), 100);
    }
  };

  const renderTopics = () => {
    const topics = LoadTopics();
    if (topics.length > 0) {
      all_topics.forEach((t) => {
        topic_ui_list.removeChild(t);
      });
      all_topics.splice(0, all_topics.length);

      topics.forEach((topic) => {
        appendTopic(topic);
      });
    } else {
      setTimeout(() => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC)), 100);
    }
  };

  const appendTopic = (topic) => {
    const t = Topic({ topic, selectTopicHandler });
    all_topics.push(t);
    topic_ui_list.append(t);
    return t;
  };

  const topicAddHandler = (e) => {
    observer.disconnect();
    if (e.detail.topic) {
      const topic = e.detail.topic;
      topicId = topic.id;
      const newT = appendTopic(topic);
      Utils.blink(newT);
      loadTopicChits();
    }
  };

  const observer = new MutationObserver(function (mutations) {
    let inc = 0;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && node.classList.contains("topic-items")) {
          if (all_topics.length > 0 && inc == all_topics.length - 1 && !topicId) {
            topicId = all_topics[all_topics.length - 1].dataset.id;
            loadTopicChits();
          }
          inc++;
        }
      });
    });
  });

  const buildTopicDom = () => {
    const topicsDom = Utils.newElem("div", "chit-topics", "chit-archive");
    const topicsList = Utils.newElem("ul", "topics-list");
    topicsDom.append(topicsList);
    observer.observe(topicsList, { childList: true });

    return topicsDom;
  };

  const container = buildTopicDom();
  const topic_ui_list = container.querySelector("#topics-list");
  return { dom: container, renderTopics, topicAddHandler, loadTopicChits };
}

const TopicMgmt = () => {
  const queryString = window.location.hash;
  let topicId = queryString.split("=")[1];

  const topic = Topics({ topicId });
  topic.renderTopics();
  topic.loadTopicChits();

  document.addEventListener(Events.RENDER_TOPIC, topic.topicAddHandler);

  return topic.dom;
};

export default TopicMgmt;
