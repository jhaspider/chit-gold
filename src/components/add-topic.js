import React, { useEffect, useRef, useState } from "react";
import Utils from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import Events from "../utils/events";
import { AddTopic } from "../utils/save_chits";

function NewTopic(props) {
  let { close } = props;
  let topicName;

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

    const newTopic = { topicName, scale: 1 };
    const id = await AddTopic(newTopic);
    setMode((oldMode) => !oldMode);
    document.dispatchEvent(new CustomEvent(Events.RENDER_TOPIC, { detail: { topic: { ...newTopic, id } } }));
    close({ ...newTopic, id });
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
    topicName = e.target.value.toUpperCase();
    if (topicName.length > 2 && promptRef.current) {
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
        <input id="topic_name" type={"text"} autoFocus placeholder="Add a Topic" autoComplete={"off"} className="container" onInput={onContentChangeHandler} onKeyUp={onKeyUpHandler}></input>
        <p id="enter-prompt" ref={promptRef}></p>
      </div>
    </div>
  );
}

export default NewTopic;
