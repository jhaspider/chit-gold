import React, { useEffect, useRef, useState } from "react";
import Events from "../utils/events";
import useApi from "../utils/save_chits";
import Utils from "../utils/utils";

const TAG = "SheetMobile - ";
function SheetMobile() {
  // chits state variable

  const [chits, setChits] = useState([]);
  const [selected_topic, setSelectedTopic] = useState(null);
  const { LoadChits } = useApi();

  // useEffect hook to load chits
  useEffect(() => {
    // listent to TOPIC_SELECT event on document
    document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);

    return () => {
      // remove TOPIC_SELECT event listener
      document.removeEventListener(Events.TOPIC_SELECT, onTopicSelect);
    };
  }, []);

  useEffect(() => {
    if (selected_topic) loadChits();
  }, [selected_topic]);

  // onTopicSelect event handler
  const onTopicSelect = (e) => {
    // set selected topic
    setSelectedTopic(e.detail.topic);
  };

  // load chits
  const loadChits = async () => {
    try {
      console.log(selected_topic);
      const chits = await LoadChits(selected_topic.id);
      console.log(TAG, chits);
      setChits(chits);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="sheet-mobile">
      {chits.map((chit) => (
        <div key={chit.id} className="chit-mobile">
          <h2 className="title">{chit.title}</h2>
          <div className="inner">{chit.text}</div>
        </div>
      ))}
    </div>
  );
}

export default SheetMobile;
