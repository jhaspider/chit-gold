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
    document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);
    return () => {
      document.removeEventListener(Events.TOPIC_SELECT, onTopicSelect);
    };
  }, []);

  useEffect(() => {
    if (selected_topic) loadChits();
  }, [selected_topic]);

  const onTopicSelect = (e) => setSelectedTopic(e.detail.topic);

  // load chits
  const loadChits = async () => {
    try {
      const chits = await LoadChits(selected_topic.id);
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
          <div className="inner" dangerouslySetInnerHTML={{ __html: chit.text }}></div>
        </div>
      ))}
    </div>
  );
}

export default SheetMobile;
