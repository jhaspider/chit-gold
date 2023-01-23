import Events from "../utils/events";
import { LoadTopics, UpdateTopic, LoadTopicDetails } from "../utils/save_chits";
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
  let all_topics = [];
  let container, topic_ui_list;
  let selectedTopic;

  const selectTopicHandler = (e) => {
    unselectPrevious();
    let topicId = e.currentTarget.dataset.id;
    selectedTopic = all_topics.find((topic) => topic.id === topicId);
    e.currentTarget.classList.add("topic-select");
    loadTopicChits();
  };

  const loadTopicChits = () => {
    if (selectedTopic) {
      history.pushState(null, null, `#?topic_id=${selectedTopic.id}`);
      setTimeout(() => document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { topic: selectedTopic } })), 100);
    }
  };

  const unselectPrevious = () => {
    if (selectedTopic) {
      const prevTopicNode = container.querySelector(`#topic-id-${selectedTopic.id}`);
      if (prevTopicNode) prevTopicNode.classList.remove("topic-select");
    }
  };

  const renderTopics = async () => {
    if (all_topics.length > 0) {
      try {
        all_topics.forEach((t) => {
          topic_ui_list.removeChild(t.dom);
        });
      } catch (e) {
        console.log(`Topic removal failed.`);
      }

      all_topics.forEach((topic) => {
        const dom = appendTopic(topic);
        topic = {
          dom,
          topic,
        };
      });
    }
  };

  const appendTopic = (topic) => {
    const t = Topic({ topic, selectTopicHandler });
    topic_ui_list.append(t);
    return t;
  };

  const topicAddHandler = (e) => {
    observer.disconnect();
    unselectPrevious();
    if (e.detail.topic) {
      selectedTopic = e.detail.topic;
      const newT = appendTopic(selectedTopic);
      const prevTopicNode = container.querySelector(`#topic-id-${selectedTopic.id}`);
      prevTopicNode.classList.add("topic-select");
      loadTopicChits();
    }
  };

  const observer = new MutationObserver(function (mutations) {
    let inc = 0;

    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.classList && node.classList.contains("topic-items")) {
          // Select the last item
          if (all_topics.length > 0 && inc == all_topics.length - 1 && !selectedTopic) {
            selectedTopic = all_topics[all_topics.length - 1];
            loadTopicChits();
          }

          // Underline/mark selected the selected topic
          if (selectedTopic && selectedTopic.id === node.dataset.id) node.classList.add("topic-select");
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
    const topicsDom = Utils.newElem("div", "chit-topics");
    const topicsList = Utils.newElem("ul", "topics-list");
    topicsDom.append(topicsList);
    observer.observe(topicsList, { childList: true });

    return topicsDom;
  };

  const loadTopicDetails = async () => {
    const queryString = window.location.hash;
    let topicId = queryString.split("=")[1];
    if (topicId) {
      const { status, topic } = await LoadTopicDetails(topicId);
      if (status) selectedTopic = topic;
    }
  };

  const loadAllTopics = async () => {
    const topics = await LoadTopics();
    all_topics = [...all_topics, ...topics];
  };

  const init = async () => {
    await loadTopicDetails();
    await loadAllTopics();
    await renderTopics();
    if (!selectedTopic) {
      setTimeout(() => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC)), 100);
    }
    await loadTopicChits();
  };

  container = buildTopicDom();
  topic_ui_list = container.querySelector("#topics-list");

  return { dom: container, init, renderTopics, topicAddHandler, loadTopicChits, updateTopicHandler };
}

const TopicMgmt = () => {
  const topic = Topics();
  topic.init();

  document.addEventListener(Events.RENDER_TOPIC, topic.topicAddHandler);
  document.addEventListener(Events.UPDATE_TOPIC, topic.updateTopicHandler);

  return topic.dom;
};

export default TopicMgmt;
