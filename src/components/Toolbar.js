import Events from "../utils/events";
import Utils from "../utils/utils";

function Toolbar() {
  let percent;
  const zoomFactor = 10;

  const onAddChit = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_SELECT));

  const onAddTopic = (e) => document.dispatchEvent(new CustomEvent(Events.BTN_ADD_TOPIC));

  const buildToolbar = () => {
    const bottomToolbar = Utils.newElem("div", "bottom-toolbar");

    const btnAdd = Utils.newElem("button", null, "add-new-chit");
    btnAdd.addEventListener("click", onAddChit);
    bottomToolbar.append(btnAdd);

    const btnTopic = Utils.newElem("button", null, "add-new-topic");
    btnTopic.addEventListener("click", onAddTopic);
    bottomToolbar.append(btnTopic);

    // create the container element
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
    bottomToolbar.append(container);

    return bottomToolbar;
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

  const container = buildToolbar();
  document.addEventListener(Events.UPDATE_ZOOM, scaleHandler);
  return container;
}

export default Toolbar;
