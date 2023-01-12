import Utils from "../utils/utils";
import { v4 as uuidv4 } from "uuid";
import Events from "../utils/events";
import { UpdateChit } from "../utils/save_chits";

function MakeChit(props) {
  let { left, top, title, scale = 1, topicId, text = "", id = uuidv4(), onArchive } = props;

  let timer;
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
    }, 2000);
  };

  const onArchiveTap = (e) => {
    e.stopPropagation();
    chit.dom.remove();
    chit.dom.dispatchEvent(new CustomEvent(Events.ARCHIVE, { detail: { id: chit.props.id } }));
  };

  const getDom = () => {
    const div = Utils.newElem("div", null, "chit");

    // Title
    const chitTitle = Utils.newElem("h2", null, "chit-title");
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
    archivelink.setAttribute("href", "#");
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
      position: positionChit,
    };
  };

  const positionChit = (new_props) => {
    const { left, top } = new_props;
    chit.dom.style.left = left;
    chit.dom.style.top = top;
    chit.props.left = left;
    chit.props.top = top;
  };

  const onSheetDrag = (e) => {
    const { left, top } = e.detail.factor;
    chit.dom.style.transition = "none";
    if (left > 0) chit.props.left += left;
    else chit.props.left -= Math.abs(left);

    if (top > 0) chit.props.top += top;
    else chit.props.top -= Math.abs(top);

    chit.dom.style.left = chit.props.left;
    chit.dom.style.top = chit.props.top;
    UpdateChit(chit.props);
  };

  const onSheetZoom = (e) => {
    const { clientX, clientY, delta } = e.detail;
    var xs = (clientX - chit.props.left) / scale,
      ys = (clientY - chit.props.top) / scale;

    scale += delta * -0.0008;

    chit.props.scale = scale;
    chit.props.left = clientX - xs * scale;
    chit.props.top = clientY - ys * scale;
    setTransform();
    UpdateChit(chit.props);
  };

  const setTransform = () => {
    // Scale
    chit.dom.style.transition = "none";
    chit.dom.style.transform = "scale(" + chit.props.scale + ")";
    chit.dom.style.transformOrigin = `0px 0px`;

    // Position
    chit.dom.style.left = chit.props.left;
    chit.dom.style.top = chit.props.top;
  };

  const chit = buildChit();
  document.addEventListener(Events.ON_SHEET_DRAG, onSheetDrag);
  document.addEventListener(Events.ON_ZOOM, onSheetZoom);
  return chit;
}

export default MakeChit;
