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
  const toolbar_offset = Utils.getDomById("toolbar").clientHeight;
  const chit_topics = Utils.getDomById("chit-topics").clientHeight;
  const topOffset = toolbar_offset + chit_topics;

  let topicId;
  let actionAddChit = false;

  const sheetMouseDown = (e) => {
    if (e.currentTarget.id === "sheet") {
      if (actionAddChit) {
        if (!tapHoldAni) {
          tapHoldAni = TapHoldAnimation({ left: e.clientX, top: e.clientY - topOffset });
          sheet.append(tapHoldAni.dom);
        }
        new_sheet_start_time = new Date().getTime();
      } else {
        initCord = { x: e.clientX, y: e.clientY };
        sheet.addEventListener("mousemove", sheetMouseMove);
      }
    }
  };

  const sheetMouseUp = (e) => {
    if (e.currentTarget.id === "sheet") {
      // Remove listener
      sheet.removeEventListener("mousemove", cheetSheetMouseMove);
      sheet.removeEventListener("mousemove", sheetMouseMove);

      // Remove animation
      if (tapHoldAni) {
        tapHoldAni.stop();
        sheet.removeChild(tapHoldAni.dom);
        tapHoldAni = null;
      }

      // Adds new looking at time
      console.log(new_sheet_start_time);
      if (new_sheet_start_time > 0) {
        let diff = new Date().getTime() - new_sheet_start_time;
        new_sheet_start_time = 0;

        if (diff >= 500) {
          const chitProps = { left: e.clientX, top: e.clientY - topOffset, title: `Chit ${all_chits.length + 1}`, topicId };
          addChit(chitProps, (element) => {
            console.log(`New item created.`);
            AddChit(element.props);
            all_chits.push(element);
          });
        }
      } else {
        if (selected_chit) {
          UpdateChit(selected_chit.props);
        }
      }
    }
  };

  const sheetMouseMove = (e) => {
    e.stopPropagation();
    const xDragFactor = e.clientX - initCord.x;
    const yDragFactor = e.clientY - initCord.y;
    const factor = { left: xDragFactor, top: yDragFactor };
    initCord = { x: e.clientX, y: e.clientY };

    document.dispatchEvent(new CustomEvent(Events.ON_SHEET_DRAG, { detail: { factor } }));
  };

  const cheetSheetMouseMove = (e) => {
    e.stopPropagation();
    // console.log(e.clientX, e.clientY);
    if (selected_chit) {
      const cords = { left: e.clientX - initCord.offsetLeft, top: e.clientY - initCord.offsetTop - topOffset };
      selected_chit.position(cords);
    }
  };

  const chitMouseDown = (e) => {
    e.stopPropagation();
    sheet.addEventListener("mousemove", cheetSheetMouseMove);

    const orgCord = e.currentTarget.getBoundingClientRect();
    initCord = { offsetLeft: e.clientX - orgCord.x, offsetTop: e.clientY - orgCord.y };
    selected_chit = all_chits.find((chit) => chit.props.id === e.currentTarget.dataset.id);
  };

  const chitArchive = (e) => {
    const chit = all_chits.find((chit) => chit.props.id == e.detail.id);
    UpdateChit({ ...chit.props, archive: true });
  };

  const addChit = (chitProps, callback) => {
    const chit = MakeChit({ ...chitProps });
    sheet.append(chit.dom);
    cursorDefault();
    chit.dom.addEventListener("mousedown", chitMouseDown);
    chit.dom.addEventListener(Events.CONTENT_SAVE, chitContentChange);
    chit.dom.addEventListener(Events.ARCHIVE, chitArchive);
    callback(chit);
  };

  const chitContentChange = () => {
    console.log(`Select Chit`, selected_chit);
    UpdateChit(selected_chit.props);
  };

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
        addChit(chit, (element) => {
          all_chits.push(element);
        });
      });
    }
  };

  const loadChitsHandler = () => {
    const queryString = window.location.hash;
    topicId = queryString.split("=")[1];
    if (topicId) {
      console.log(`Topic Id : ${topicId}`);
      renderOldChits(topicId);
    }
  };

  const documentKeyPress = (e) => {
    console.log(e);
    cursorDefault();
  };

  const cursorDefault = () => {
    sheet.style.cursor = "default";
    actionAddChit = false;
  };

  const btnAddSelect = (e) => {
    sheet.style.cursor = "crosshair";
    actionAddChit = true;
  };

  const onScroll = (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      document.dispatchEvent(new CustomEvent(Events.ON_ZOOM, { detail: { clientX: e.clientX, clientY: e.clientY, delta: e.deltaY } }));
    }
  };

  const sheet = build_sheet();
  document.addEventListener(Events.TOPIC_SELECT, loadChitsHandler);
  document.addEventListener(Events.BTN_ADD_SELECT, btnAddSelect);
  document.addEventListener("keydown", documentKeyPress);
  document.addEventListener("mousewheel", onScroll, { passive: false });

  setTimeout(() => {
    sheet.style.height = window.innerHeight - topOffset;
  }, 500);
  loadChitsHandler();
  return sheet;
}

export { Sheet as default };
