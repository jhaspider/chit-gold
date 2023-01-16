import Events from "../utils/events";
import { LoadTopics, UpdateTopic } from "../utils/save_chits";
import Utils from "../utils/utils";

function Topic({ topic, selectTopicHandler }) {
  const topicDom = Utils.newElem("a");
  topicDom.innerHTML = topic.topicName;

  const li = Utils.newElem("li", `topic-id-${topic.id}`, "topic-items");
  li.addEventListener("click", selectTopicHandler);
  li.dataset.id = topic.id;
  li.append(topicDom);
  return li;
}

function Topics(props) {
  const all_topics = [];
  let { topicId } = props;

  const selectTopicHandler = (e) => {
    unselectPrevious();
    topicId = e.currentTarget.dataset.id;
    e.currentTarget.classList.add("topic-select");
    loadTopicChits();
  };

  const loadTopicChits = () => {
    if (topicId) {
      history.pushState(null, null, `#?topic_id=${topicId}`);

      let tp = all_topics.find((topic) => topic.topic.id === topicId);
      if (!tp) return;
      setTimeout(() => document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { topic: tp.topic } })), 100);
    }
  };

  const unselectPrevious = () => {
    const prevTopicNode = container.querySelector(`#topic-id-${topicId}`);
    prevTopicNode.classList.remove("topic-select");
  };

  const renderTopics = () => {
    const topics = LoadTopics();
    if (topics.length > 0) {
      all_topics.forEach((t) => {
        topic_ui_list.removeChild(t.dom);
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
    all_topics.push({
      dom: t,
      topic,
    });
    topic_ui_list.append(t);
    return t;
  };

  const topicAddHandler = (e) => {
    observer.disconnect();
    unselectPrevious();
    if (e.detail.topic) {
      const topic = e.detail.topic;
      topicId = topic.id;
      const newT = appendTopic(topic);
      // Utils.blink(newT);
      const prevTopicNode = container.querySelector(`#topic-id-${topicId}`);
      prevTopicNode.classList.add("topic-select");
      loadTopicChits();
    }
  };

  const observer = new MutationObserver(function (mutations) {
    let inc = 0;
    console.log(`Selected Topic : ${topicId}`);
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && node.classList.contains("topic-items")) {
          if (all_topics.length > 0 && inc == all_topics.length - 1 && !topicId) {
            topicId = all_topics[all_topics.length - 1].topic.id;
            loadTopicChits();
          }
          if (topicId === node.dataset.id) node.classList.add("topic-select");
          inc++;
        }
      });
    });
  });

  const updateTopicHandler = (e) => {
    const { id, scale } = e.detail;
    UpdateTopic({ id, scale });
  };

  const buildTopicDom = () => {
    const topicsDom = Utils.newElem("div", "chit-topics", "chit-archive");
    const topicsList = Utils.newElem("ul", "topics-list");
    topicsDom.append(topicsList);
    observer.observe(topicsList, { childList: true });

    return topicsDom;
  };

  const container = buildTopicDom();
  const topic_ui_list = container.querySelector("#topics-list");
  return { dom: container, renderTopics, topicAddHandler, loadTopicChits, updateTopicHandler };
}

const TopicMgmt = () => {
  const queryString = window.location.hash;
  let topicId = queryString.split("=")[1];

  const topic = Topics({ topicId });
  topic.renderTopics();
  topic.loadTopicChits();

  document.addEventListener(Events.RENDER_TOPIC, topic.topicAddHandler);
  document.addEventListener(Events.UPDATE_TOPIC, topic.updateTopicHandler);

  return topic.dom;
};

export default TopicMgmt;
