import Utils from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import Events from "../utils/events";
import { UpdateChit } from "../utils/save_chits";
import { remove } from "lodash";

export const ORDER = {
  TOP: "top",
  BOTTOM: "bottom",
};

function Chit(props) {
  let { left, top, title, scale = 1, topicId, text = "", id = uuidv4(), onArchive } = props;

  let timer;
  let chit;

  const onTitleChangeHandler = (e) => {
    chit.props = {
      ...chit.props,
      title: e.target.innerText,
    };
    triggerSave();
  };

  const onContentChangeHandler = (e) => {
    chit.props = {
      ...chit.props,
      text: e.target.innerHTML,
    };
    triggerSave();
  };

  const triggerSave = () => {
    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      chit.dom.dispatchEvent(new CustomEvent(Events.CONTENT_SAVE));
    }, 500);
  };

  const onArchiveTap = (e) => {
    e.stopPropagation();
    console.log(chit.props);
    chit.dom.dispatchEvent(new CustomEvent(Events.ARCHIVE, { detail: { id: chit.props.id } }));
    removeChit();
  };

  const getDom = () => {
    const div = Utils.newElem("div", null, "chit");

    // Title
    const chitTitle = Utils.newElem("h2", "chit-title", "chit-title");
    chitTitle.contentEditable = true;
    chitTitle.innerHTML = title;
    chitTitle.addEventListener("input", onTitleChangeHandler);
    div.append(chitTitle);

    // Body
    const cellInner = Utils.newElem("div", null, "chit-inner");
    cellInner.contentEditable = true;
    cellInner.addEventListener("input", onContentChangeHandler);
    cellInner.innerHTML = text;
    div.append(cellInner);

    // Archive
    const cellarchive = Utils.newElem("div", null, "chit-archive");
    div.append(cellarchive);

    const archivelink = Utils.newElem("a");
    archivelink.setAttribute("href", "javascript:void(0)");
    archivelink.innerHTML = "Archive";
    cellarchive.append(archivelink);
    archivelink.addEventListener("click", onArchiveTap);
    archivelink.addEventListener("mousedown", (e) => e.stopPropagation());
    archivelink.addEventListener("mouseup", (e) => e.stopPropagation());

    return div;
  };

  const buildChit = () => {
    const dom = getDom();
    dom.style.top = top;
    dom.style.left = left;
    dom.style.transformOrigin = `0px 0px`;
    dom.style.transform = "scale(" + scale + ")";
    dom.dataset.id = id;

    return {
      dom,
      props: {
        left,
        top,
        title,
        text,
        topicId,
        id,
        scale,
      },
    };
  };

  const positionChit = (new_props) => {
    const { left, top } = new_props;
    chit.dom.style.left = left;
    chit.dom.style.top = top;
    chit.props.left = left;
    chit.props.top = top;
  };

  const onSheetDrag = ({ left, top }) => {
    if (chit) {
      chit.dom.style.transition = "none";
      if (left > 0) chit.props.left += left;
      else chit.props.left -= Math.abs(left);

      if (top > 0) chit.props.top += top;
      else chit.props.top -= Math.abs(top);

      chit.dom.style.left = chit.props.left;
      chit.dom.style.top = chit.props.top;
      UpdateChit(chit.props);
    }
  };

  const onSheetZoom = ({ clientX, clientY, delta, new_scale }) => {
    if (chit) {
      var xs = (clientX - chit.props.left) / scale,
        ys = (clientY - chit.props.top) / scale;

      if (delta) scale += delta * -0.0008;
      if (new_scale) scale = new_scale;
      // console.log(`X : ${xs}, Y : ${ys}, ${scale}`);
      chit.props.left = clientX - xs * scale;
      chit.props.top = clientY - ys * scale;
      setTransform();
      UpdateChit(chit.props);
    }
  };

  const setTransform = () => {
    // Scale
    chit.dom.style.transition = "none";
    chit.dom.style.transform = "scale(" + scale + ")";
    chit.dom.style.transformOrigin = `0px 0px`;

    // Position
    chit.dom.style.left = chit.props.left;
    chit.dom.style.top = chit.props.top;
  };

  const removeChit = () => {
    if (chit && chit.dom) {
      chit.dom.remove();
      chit = null;
    }
  };

  const setOrder = (index) => {
    if (chit && chit.dom) chit.dom.style.zIndex = index;
  };

  const setFocus = () => {
    if (chit && chit.dom) {
      const chitTitle = chit.dom.querySelector("#chit-title");
      var range = document.createRange();
      range.selectNodeContents(chitTitle);
      range.collapse(false);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  chit = buildChit();
  return { chit, remove: removeChit, position: positionChit, drag: onSheetDrag, scale: onSheetZoom, order: setOrder, focus: setFocus };
}

const ChitMgmt = (props) => {
  const chit = Chit(props);
  return chit;
};

export default ChitMgmt;
