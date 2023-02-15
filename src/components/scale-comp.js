import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useChitContext } from "../chit-provider";
import Events from "../utils/events";
import useApi from "../utils/save_chits";
import Utils from "../utils/utils";

const Divider = () => {
  return <div className="divider"></div>;
};

const Modes = ["private", "public", "unlisted"];
const zoomFactor = 10;

function ScaleComp(props) {
  const { onAddChit, onAddTopic, onPrompt, topic } = props;

  const [percent, setPercent] = useState(0);
  const [modeInd, setModeInd] = useState(-1);
  const [scale, setScale] = useState(null);
  const { user } = useChitContext();
  const { CopyTopic, UpdateTopic } = useApi();
  const [isCopiable, setIsCopiable] = useState(false);

  useEffect(() => {
    document.addEventListener(Events.UPDATE_ZOOM, scaleHandler);
    return () => document.removeEventListener(Events.UPDATE_ZOOM, scaleHandler);
  });

  useEffect(() => {
    if (topic) {
      document.dispatchEvent(new CustomEvent(Events.ON_ZOOM, { detail: { percent } }));
      setScale(`${percent % 1 === 0 ? percent : percent.toFixed(1)}%`);
    }
  }, [percent]);

  useEffect(() => {
    if (modeInd >= 0) onPrompt(`Mode : ${Utils.capitalize(Modes[modeInd])}`);
  }, [modeInd]);

  useEffect(() => {
    if (topic) {
      const existingInd = Modes.findIndex((md) => md === topic.mode);
      setModeInd(existingInd);

      setIsCopiable(topic.uid !== user.uid ? true : false);
    }
  }, [topic]);

  const zoomInHandler = (type) => {
    let new_percent = percent;
    if (percent % zoomFactor != 0) {
      new_percent = type ? Math.ceil(percent / zoomFactor) * zoomFactor : Math.floor(percent / zoomFactor) * zoomFactor;
    } else {
      new_percent = type ? percent + zoomFactor : percent - zoomFactor;
    }

    setPercent(new_percent);
  };

  const scaleHandler = (e) => setPercent(e.detail.scale * 100);

  const changeMode = async (e) => {
    if (topic.uid === user.uid) {
      const newModeInd = modeInd < 0 || modeInd === Modes.length - 1 ? 0 : modeInd + 1;
      setModeInd(newModeInd);
      await UpdateTopic({ id: topic.id, mode: Modes[newModeInd].toLowerCase() });
    } else {
      onPrompt(`Only the author can change the mode`);
    }
  };

  // Copy the topic using the topic id
  const copytheTopic = async (e) => {
    const topicId = topic.id;
    const newTopic = await CopyTopic(topicId);
    if (newTopic) {
      document.dispatchEvent(new CustomEvent(Events.RENDER_TOPIC, { detail: { topic: newTopic } }));
      onPrompt(`Topic copied successfully`);
    }
  };

  const mode = Modes[modeInd];

  return (
    <div id="bottom-toolbar">
      <img className="btn-class" onClick={onAddChit} src="/icons/new-chit.png" onMouseOver={(e) => onPrompt(`Click to add a note or press "A"`)} />
      <img className="btn-class" onClick={onAddTopic} src="/icons/topics.png" onMouseOver={(e) => onPrompt(`Click to add a Topic or press "T"`)} />

      {scale !== null && (
        <>
          <Divider />
          <div className="scale-container">
            <img className="btn-class" onMouseOver={(e) => onPrompt(`Zoom Out`)} onClick={(e) => zoomInHandler(0)} src="/icons/scale-down.png" />
            <p id="scale" className="middle-text">
              {scale}
            </p>
            <img className="btn-class" onMouseOver={(e) => onPrompt(`Zoom In`)} onClick={(e) => zoomInHandler(1)} src="/icons/scale-up.png" />
          </div>
        </>
      )}

      {mode && (
        <>
          <Divider />
          <img className="btn-visibility" onMouseOver={(e) => onPrompt(`Mode : ${Utils.capitalize(mode)}`)} onClick={changeMode} src={`/icons/${mode}.png`} />
        </>
      )}
      {isCopiable && (
        <>
          <Divider />
          <img className="btn-class" src="/icons/clone-action.png" onClick={copytheTopic} onMouseOver={(e) => onPrompt(`Clone`)} />
        </>
      )}
    </div>
  );
}

export default ScaleComp;
