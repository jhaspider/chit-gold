import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChitContext } from "../chit-provider";
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

  const { topic_id } = useParams();
  const { user } = useChitContext();
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener(Events.RENDER_TOPIC, topicAddHandler);
    return () => document.removeEventListener(Events.RENDER_TOPIC, topicAddHandler);
  }, []);

  useEffect(() => {
    (async () => {
      if (topic_id) {
        await loadTopicDetails();
      }
    })();
  }, [topic_id]);

  useEffect(() => {
    init();
  }, [user]);

  useEffect(() => {
    if (selectedTopic) {
      if (topic_id !== selectedTopic.id) navigate(`/console/topic/${selectedTopic.id}`);
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

  const loadTopicDetails = async () => {
    if (topic_id) {
      const { status, topic } = await LoadTopicDetails(topic_id);
      if (status) setSelectedTopic(topic);
    }
  };

  const loadAllTopics = async () => {
    const topics = await LoadTopics();

    if (!topic_id && !selectedTopic) {
      if (topics.length > 0) {
        setSelectedTopic(topics[topics.length - 1]);
      } else {
        document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));
      }
    }

    setAllTopics((_) => [...topics]);
  };

  const init = async () => {
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
