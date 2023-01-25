import React, { useEffect, useState } from "react";
import Events from "../utils/events";
import Utils from "../utils/utils";

function ScaleComp(props) {
  const { onAddChit, onAddTopic } = props;
  const [percent, setPercent] = useState(0);
  const zoomFactor = 10;

  const [scale, setScale] = useState(0);

  useEffect(() => {
    document.addEventListener(Events.UPDATE_ZOOM, scaleHandler);
    return () => {
      document.removeEventListener(Events.UPDATE_ZOOM, scaleHandler);
    };
  }, []);

  useEffect(() => {
    document.dispatchEvent(new CustomEvent(Events.ON_ZOOM, { detail: { percent } }));
    setScale(`${percent % 1 === 0 ? percent : percent.toFixed(1)}%`);
  }, [percent]);

  const zoomInHandler = (type) => {
    let new_percent = percent;
    if (percent % zoomFactor != 0) {
      new_percent = type ? Math.ceil(percent / zoomFactor) * zoomFactor : Math.floor(percent / zoomFactor) * zoomFactor;
    } else {
      new_percent = type ? percent + zoomFactor : percent - zoomFactor;
    }

    setPercent(new_percent);
  };

  const scaleHandler = (e) => {
    setPercent(e.detail.scale * 100);
  };

  return (
    <div id="bottom-toolbar">
      <img className="btn-class" onClick={onAddChit} src="/icons/new-chit.png" />
      <img className="btn-class" onClick={onAddTopic} src="/icons/topics.png" />
      <div className="scale-container">
        <img className="btn-class" onClick={(e) => zoomInHandler(0)} src="/icons/scale-down.png" />
        <p id="scale" className="middle-text">
          {scale}
        </p>
        <img className="btn-class" onClick={(e) => zoomInHandler(1)} src="/icons/scale-up.png" />
      </div>
    </div>
  );
}

export default ScaleComp;
