import Events from "../utils/events";
import Utils from "../utils/utils";

function ScaleComp() {
  let percent;
  const zoomFactor = 10;

  const buildDom = () => {
    const container = Utils.newElem("div", null, "scale-container");

    // create the left button
    const leftButton = Utils.newElem("button", null, "left-button");
    leftButton.addEventListener("click", (e) => zoomInHandler(0));
    leftButton.innerHTML = "-";
    container.appendChild(leftButton);

    // create the middle text
    var middleText = Utils.newElem("p", "scale", "middle-text");
    middleText.innerHTML = "";
    container.appendChild(middleText);

    // create the right button
    const rightButton = Utils.newElem("button", null, "right-button");
    rightButton.addEventListener("click", (e) => zoomInHandler(1));
    rightButton.innerHTML = "+";

    container.appendChild(rightButton);
    return container;
  };

  const zoomInHandler = (type) => {
    if (percent % zoomFactor != 0) {
      percent = type ? Math.ceil(percent / zoomFactor) * zoomFactor : Math.floor(percent / zoomFactor) * zoomFactor;
    } else {
      percent = type ? percent + zoomFactor : percent - zoomFactor;
    }

    setPercent();
    document.dispatchEvent(new CustomEvent(Events.ON_ZOOM, { detail: { percent } }));
  };

  const scaleHandler = (e) => {
    percent = e.detail.scale * 100;
    setPercent();
  };

  const setPercent = () => {
    container.querySelector("#scale").innerHTML = `${percent % 1 === 0 ? percent : percent.toFixed(1)}%`;
  };

  const container = buildDom();
  document.addEventListener(Events.UPDATE_ZOOM, scaleHandler);
  return { dom: container };
}

export default ScaleComp;
