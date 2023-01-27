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
  const [prompt, setPrompt] = useState("");
  const promptRef = useRef(null);

  useEffect(() => {
    document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);
    return () => document.removeEventListener(Events.TOPIC_SELECT, onTopicSelect);
  }, []);

  useEffect(() => {
    if (topic && topic?.uid !== user?.uid) setPrompt(promptText);
    else setPrompt("");
  }, [topic]);

  useEffect(() => {
    if (promptRef.current) {
      Utils.blink(promptRef.current);
      setTimeout(() => {
        setPrompt("");
      }, 2100);
    }
  }, [prompt]);

  const onAddChit = (e) => {
    if (topic.uid === user.uid) document.dispatchEvent(new CustomEvent(Events.BTN_ADD_SELECT));
    else setPrompt(promptText);
  };

  const onAddTopic = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));

  const onTopicSelect = (e) => setTopic(e.detail.topic);

  return (
    <div id="toolbar-container">
      <div className="prompt-container">
        {prompt && (
          <p className="blink" ref={promptRef}>
            {prompt}
          </p>
        )}
      </div>
      <div className="upper-container">
        <UserComp />
        <ScaleComp onAddChit={onAddChit} onAddTopic={onAddTopic} onPrompt={setPrompt} topic={topic} />
        <div className="tool-topic">
          <h2 id="topic-label">{topic.topicName}</h2>
        </div>
      </div>

      <DevOnly />
    </div>
  );
}

export default Toolbar;
