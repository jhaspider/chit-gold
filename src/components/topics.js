import Events from "../utils/events";
import { LoadTopics } from "../utils/save_chits";
import Utils from "../utils/utils";

function Topic({ topic, selectTopicHandler }) {
  const topicDom = Utils.newElem("a");
  // topicDom.setAttribute("href", `#?topic_id=${topic.id}`);
  topicDom.innerHTML = topic.topicName;

  const li = Utils.newElem("li", null, "topic-items");
  li.addEventListener("click", selectTopicHandler);
  li.dataset.id = topic.id;
  li.append(topicDom);
  return li;
}

function Topics() {
  const all_topics = [];

  const selectTopicHandler = (e) => {
    const topicId = e.currentTarget.dataset.id;
    loadTopicChits(topicId);
  };

  const loadTopicChits = (topicId) => {
    history.pushState(null, null, `#?topic_id=${topicId}`);
    document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { topicId } }));
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
  };

  const topicAddHandler = (e) => {
    observer.disconnect();
    if (e.detail.topic) {
      const topic = e.detail.topic;
      appendTopic(topic);
      loadTopicChits(topic.id);
    }
  };

  const observer = new MutationObserver(function (mutations) {
    const queryString = window.location.hash;
    let topicId = queryString.split("=")[1];
    if (topicId) loadTopicChits(topicId);

    let inc = 0;
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && node.classList.contains("topic-items")) {
          if (all_topics.length > 0 && inc == all_topics.length - 1 && !topicId) {
            topicId = all_topics[all_topics.length - 1].dataset.id;
            loadTopicChits(topicId);
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
  document.addEventListener(Events.RENDER_TOPIC, topicAddHandler);
  renderTopics();

  return container;
}

export default Topics;
