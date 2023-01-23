import React, { useEffect, useState } from "react";
import Events from "../utils/events";
import Utils from "../utils/utils";
import DevOnly from "./dev_only";
import ScaleComp from "./scale-comp";
import UserComp from "./user-comp";

function Toolbar() {
  const [topic, setTopic] = useState("");

  useEffect(() => {
    document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);

    return () => {
      document.removeEventListener(Events.TOPIC_SELECT, onTopicSelect);
    };
  }, []);

  const onAddChit = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_SELECT));

  const onAddTopic = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));

  const onTopicSelect = (e) => setTopic(e.detail.topic);

  return (
    <div id="toolbar-container">
      <div className="upper-container">
        <UserComp />
        <div id="bottom-toolbar">
          <button className="add-new-chit" onClick={onAddChit}></button>
          <button className="add-new-topic" onClick={onAddTopic}></button>
          <ScaleComp />
        </div>
        <div className="tool-topic">
          <h2 id="topic-label">{topic.topicName}</h2>
        </div>
      </div>
      <DevOnly />
    </div>
  );
}

export default Toolbar;
