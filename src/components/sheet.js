import _ from "lodash";
import Events from "../utils/events.js";
import { archiveChit, LoadChits, AddChit, UpdateChit } from "../utils/save_chits.js";
import Utils from "../utils/utils.js";
import MakeChit from "./chit.js";
import TapHoldAnimation from "./tap-hold-animation.js";

function Sheet() {
  let all_chits = [];

  let selected_chit;
  let initCord;
  let new_sheet_start_time = 0;
  let tapHoldAni;
  const toolbar_offset = 24;
  let topicId;

  const sheetMouseDown = (e) => {
    if (e.currentTarget.id === "sheet") {
      if (!tapHoldAni) {
        tapHoldAni = TapHoldAnimation({ left: e.clientX, top: e.clientY - toolbar_offset });
        sheet.append(tapHoldAni.dom);
      }

      new_sheet_start_time = new Date().getTime();
    }
  };

  const sheetMouseUp = (e) => {
    if (e.currentTarget.id === "sheet") {
      // Remove listener
      sheet.removeEventListener("mousemove", sheetMouseMove);

      // Remove animation
      if (tapHoldAni) {
        tapHoldAni.stop();
        sheet.removeChild(tapHoldAni.dom);
        tapHoldAni = null;
      }

      // Adds new looking at time
      if (new_sheet_start_time > 0) {
        let diff = new Date().getTime() - new_sheet_start_time;
        new_sheet_start_time = 0;

        if (diff >= 500) {
          const chitProps = { left: e.clientX, top: e.clientY - toolbar_offset, title: `Chit ${all_chits.length + 1}`, topicId };
          const chit = addChit(chitProps);

          AddChit(chit.props);
          all_chits.push(chit);
        }
      } else {
        UpdateChit(selected_chit.props);
      }
    }
  };

  const sheetMouseMove = (e) => {
    e.stopPropagation();
    const cords = { left: e.clientX - initCord.offsetLeft, top: e.clientY - initCord.offsetTop - toolbar_offset };
    selected_chit.position(cords);
  };

  const chitMouseDown = (e) => {
    e.stopPropagation();
    sheet.addEventListener("mousemove", sheetMouseMove);

    const orgCord = e.currentTarget.getBoundingClientRect();
    initCord = { offsetLeft: e.clientX - orgCord.x, offsetTop: e.clientY - orgCord.y };
    selected_chit = all_chits.find((chit) => chit.props.id === e.currentTarget.dataset.id);
  };

  const chitArchive = (e) => {
    const chit = all_chits.find((chit) => chit.props.id == e.detail.id);
    UpdateChit({ ...chit.props, archive: true });
  };

  const addChit = (chitProps) => {
    const chit = MakeChit({ ...chitProps });
    sheet.append(chit.dom);
    chit.dom.addEventListener("mousedown", chitMouseDown);
    chit.dom.addEventListener(Events.CONTENT_SAVE, chitContentChange);
    chit.dom.addEventListener(Events.ARCHIVE, chitArchive);
    return chit;
  };

  const chitContentChange = () => UpdateChit(selected_chit.props);

  const build_sheet = () => {
    const sheetDom = Utils.newElem("div", "sheet");
    sheetDom.addEventListener("mousedown", sheetMouseDown);
    sheetDom.addEventListener("mouseup", sheetMouseUp);
    return sheetDom;
  };

  const renderOldChits = (topicId) => {
    // Flush previously loaded sheets
    all_chits.forEach((chit) => {
      sheet.removeChild(chit.dom);
    });

    all_chits.splice(0, all_chits.length);

    const chits = LoadChits(topicId);
    if (chits) {
      chits.forEach((chit) => {
        const oldChit = addChit(chit);
        all_chits.push(oldChit);
      });
    }
  };

  const topicSelectHandler = (e) => {
    topicId = e.detail.id;
    renderOldChits(topicId);
  };

  const sheet = build_sheet();
  document.addEventListener(Events.TOPIC_SELECT, topicSelectHandler);
  return sheet;
}

export { Sheet as default };
