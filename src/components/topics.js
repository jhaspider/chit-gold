import React, { useEffect, useRef, useState } from "react";
import Events from "../utils/events";
import { LoadTopics, UpdateTopic, LoadTopicDetails } from "../utils/save_chits";

function Topic({ topic, selected, selectTopicHandler }) {
  const onTopicTap = (e) => {
    e.currentTarget.classList.add("topic-select");
    selectTopicHandler(topic);
  };

  return (
    <li id={`topic-id-${topic.id}`} className={`topic-items ${selected ? "topic-select" : ""}`} onClick={onTopicTap}>
      <a href="" onClick={(e) => e.preventDefault()}>
        {topic.topicName}
      </a>
    </li>
  );
}

function Topics(props) {
  const topic_ui_list = useRef(null);
  const [all_topics, setAllTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    document.addEventListener(Events.RENDER_TOPIC, topicAddHandler);
    // document.addEventListener(Events.UPDATE_TOPIC, topic.updateTopicHandler);

    init();

    return () => {
      document.removeEventListener(Events.RENDER_TOPIC, topicAddHandler);
    };
  }, []);

  useEffect(() => {
    if (all_topics.length > 0 && !selectedTopic) {
      setSelectedTopic(all_topics[all_topics.length - 1]);
    }
  }, [all_topics.length]);

  useEffect(() => {
    if (selectedTopic) {
      const queryString = window.location.hash;
      let topicId = queryString.split("=")[1];
      if (topicId !== selectedTopic.id) history.pushState(null, null, `#?topic_id=${selectedTopic.id}`);
      document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { topic: selectedTopic } }));
    }
  }, [selectedTopic]);

  const selectTopicHandler = (topic) => {
    unselectPrevious();
    setSelectedTopic(topic);
  };

  const unselectPrevious = () => {
    if (selectedTopic) {
      const prevTopicNode = topic_ui_list.current.querySelector(`#topic-id-${selectedTopic.id}`);
      if (prevTopicNode) prevTopicNode.classList.remove("topic-select");
    }
  };

  const topicAddHandler = (e) => {
    unselectPrevious();
    const newTopic = e.detail.topic;
    if (newTopic) {
      setSelectedTopic(newTopic);
      setAllTopics((prevTopics) => [...prevTopics, newTopic]);
    }
  };

  const updateTopicHandler = (e) => {
    const { id, scale } = e.detail;
    UpdateTopic({ id, scale });
  };

  const loadTopicDetails = async () => {
    const queryString = window.location.hash;
    let topicId = queryString.split("=")[1];
    if (topicId) {
      const { status, topic } = await LoadTopicDetails(topicId);
      if (status) setSelectedTopic(topic);
    }
  };

  const loadAllTopics = async () => {
    const topics = await LoadTopics();
    setAllTopics((prevTopics) => [...prevTopics, ...topics]);
  };

  const init = async () => {
    await loadTopicDetails();
    await loadAllTopics();
  };

  return (
    <div id="topics-list">
      <ul id="topics-list" ref={topic_ui_list}>
        {all_topics.map((topic, ind) => {
          return <Topic key={`topic-${ind}`} selected={topic.id === selectedTopic?.id} topic={topic} selectTopicHandler={selectTopicHandler} />;
        })}
      </ul>
    </div>
  );
}

export default Topics;
