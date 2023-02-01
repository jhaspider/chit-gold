import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChitContext } from "../chit-provider";
import Events from "../utils/events";
import useApi from "../utils/save_chits";

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
  const { LoadTopics, LoadTopicDetails } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener(Events.RENDER_TOPIC, topicAddHandler);
    return () => document.removeEventListener(Events.RENDER_TOPIC, topicAddHandler);
  }, []);

  useEffect(() => {
    (async () => {
      if (user) {
        await loadAllTopics();
        if (topic_id) await loadTopicDetails();
      }
    })();
  }, [user, topic_id]);

  useEffect(() => {
    if (selectedTopic) {
      document.dispatchEvent(new CustomEvent(Events.TOPIC_SELECT, { detail: { topic: selectedTopic } }));
    }
  }, [selectedTopic]);

  const selectTopicHandler = (topic) => {
    unselectPrevious();
    if (topic_id !== topic.id) navigate(`/console/topic/${topic.id}`);
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
      if (topic_id !== newTopic.id) navigate(`/console/topic/${newTopic.id}`);
      setAllTopics((prevTopics) => [...prevTopics, newTopic]);
    }
  };

  const loadTopicDetails = async () => {
    if (topic_id) {
      const topic = await LoadTopicDetails(topic_id);
      if (topic) {
        setSelectedTopic(topic);
      }
    }
  };

  const loadAllTopics = async () => {
    const topics = await LoadTopics();
    if (!topic_id && !selectedTopic) {
      if (topics && topics.length > 0) {
        const newTopic = topics[topics.length - 1];
        navigate(`/console/topic/${newTopic.id}`);
      } else {
        document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));
      }
    }

    if (topics) setAllTopics((_) => [...topics]);
  };

  return (
    <div id="topics-list">
      <ul className="user-topics" ref={topic_ui_list}>
        {all_topics.map((topic, ind) => {
          return <Topic key={`topic-${ind}`} selected={topic.id === selectedTopic?.id} topic={topic} selectTopicHandler={selectTopicHandler} />;
        })}
      </ul>
    </div>
  );
}

export default Topics;
