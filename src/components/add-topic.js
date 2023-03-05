import React, { useEffect, useRef, useState } from "react";
import Utils from "../utils/utils";
import Events from "../utils/events";

import { useChitContext } from "../chit-provider";
import useApi from "../utils/save_chits";

function NewTopic(props) {
  let { close } = props;
  let topicName;
  const { user } = useChitContext();
  const { AddTopic } = useApi();

  const [mode, setMode] = useState(false);
  const promptRef = useRef(null);

  useEffect(() => {
    document.addEventListener(Events.BTN_ADD_TOPIC, onTopicAdd);
    document.addEventListener("keydown", onKeyPress);
    return () => {
      document.removeEventListener(Events.BTN_ADD_TOPIC, onTopicAdd);
      document.removeEventListener("keydown", onKeyPress);
    };
  });

  const onTopicAdd = (e) => {
    setMode((oldMode) => !oldMode);
  };

  const onSaveTap = async (e) => {
    if (!topicName) {
      prompt(`Enter a topic name`);
      return;
    }

    const newTopic = { topicName, scale: 0.7, mode: "private", uid: user.uid };
    try {
      const id = await AddTopic(newTopic);
      if (!id) throw new Error("Error adding topic");
      setMode((oldMode) => !oldMode);
      document.dispatchEvent(new CustomEvent(Events.RENDER_TOPIC, { detail: { topic: { ...newTopic, id } } }));
      close({ ...newTopic, id });
    } catch (e) {}
  };

  const backgroundTap = (e) => {
    if (e.target.id === "bgcontainer") {
      setMode((oldMode) => !oldMode);
      close();
    }
  };

  const onKeyPress = (e) => {
    if (e.code === "Escape") {
      setMode(false);
      close();
    }
  };

  const onContentChangeHandler = (e) => {
    topicName = e.target.value;

    if (topicName.length == 2 && promptRef.current) {
      prompt(`Hit "Enter" to save`);
    }
  };

  const prompt = (msg) => {
    promptRef.current.innerHTML = msg;
    Utils.blink(promptRef.current);
  };

  const onKeyUpHandler = (e) => {
    if (e.code === "Enter") onSaveTap();
  };

  if (!mode) return null;
  return (
    <div id="bgcontainer" className="add-group-container" onClick={backgroundTap}>
      <div className="add-group">
        <input
          id="topic_name"
          type={"text"}
          maxLength="40"
          autoFocus
          placeholder="Add a Topic"
          autoComplete={"off"}
          className="container"
          onInput={onContentChangeHandler}
          onKeyUp={onKeyUpHandler}></input>
        <p id="enter-prompt" ref={promptRef}></p>
      </div>
    </div>
  );
}

export default NewTopic;
