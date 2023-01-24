import React, { useEffect, useRef, useState } from "react";
import { useChitContext } from "../chit-provider";
import Events from "../utils/events";
import Utils from "../utils/utils";
import DevOnly from "./dev_only";
import ScaleComp from "./scale-comp";
import UserComp from "./user-comp";

const promptText = "Read only sheet. You can play around but the edits don't save.";
function Toolbar() {
  const [topic, setTopic] = useState("");
  const { user } = useChitContext();
  const promptRef = useRef(null);

  useEffect(() => {
    document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);
    return () => document.removeEventListener(Events.TOPIC_SELECT, onTopicSelect);
  }, []);

  const onAddChit = (e) => {
    if (topic.uid === user.uid) document.dispatchEvent(new CustomEvent(Events.BTN_ADD_SELECT));
    else prompt(promptText);
  };

  const onAddTopic = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));

  const onTopicSelect = (e) => setTopic(e.detail.topic);

  const prompt = (msg) => {
    promptRef.current.innerHTML = msg;
    Utils.blink(promptRef.current);
  };

  return (
    <div id="toolbar-container">
      <div className="prompt-container">
        {topic?.uid !== user?.uid && (
          <p className="blink" ref={promptRef}>
            {promptText}
          </p>
        )}
      </div>
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
