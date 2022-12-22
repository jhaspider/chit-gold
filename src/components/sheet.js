import _ from "lodash";
import Events from "../utils/events.js";
import { archiveChit, LoadChits, SaveChits } from "../utils/save_chits.js";
import Utils from "../utils/utils.js";
import MakeChit from "./chit.js";
import TapHoldAnimation from "./tap-hold-animation.js";

function Sheet() {
  const all_chits = [];

  let selected_chit;
  let initCord;
  let new_sheet_start_time = 0;
  let tapHoldAni;
  const toolbar_offset = 24;

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
          const chitProps = { left: e.clientX, top: e.clientY - toolbar_offset, title: `Chit ${all_chits.length + 1}` };
          addChit(chitProps);
        }
      }

      // Save board
      saveBoard();
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

  const chitArchive = (id) => {
    archiveChit(all_chits, id);
  };

  const addChit = (chitProps) => {
    const chit = MakeChit({ ...chitProps, onArchive: chitArchive });
    sheet.append(chit.dom);
    chit.dom.addEventListener("mousedown", chitMouseDown);
    chit.dom.addEventListener(Events.CONTENT_SAVE, saveBoard);
    all_chits.push(chit);
  };

  const saveBoard = () => SaveChits(all_chits);

  const build_sheet = () => {
    const sheetDom = Utils.newElem("div", "sheet");
    sheetDom.addEventListener("mousedown", sheetMouseDown);
    sheetDom.addEventListener("mouseup", sheetMouseUp);
    return sheetDom;
  };

  const renderOldChits = () => {
    const chits = LoadChits();
    if (chits) {
      chits.forEach((chit) => {
        addChit(chit);
      });
    }
  };

  const sheet = build_sheet();
  renderOldChits();
  return sheet;
}

export { Sheet as default };
