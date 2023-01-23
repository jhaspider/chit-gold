import _ from "lodash";
import Events from "../utils/events.js";
import { LoadChits, AddChit, UpdateChit, UpdateAllChits } from "../utils/save_chits.js";
import Utils from "../utils/utils.js";
import ChitMgmt, { ORDER } from "./chit.js";
import TapHoldAnimation from "./tap-hold-animation.js";
import NewTopic from "./add-topic";

function Sheet() {
  let all_chits = [];

  let selected_chit;
  let initCord;
  let new_sheet_start_time = 0;
  let tapHoldAni;
  let topOffset = 0;

  let selected_topic;
  let actionAddChit = false;
  let newTopic;

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
      if (new_sheet_start_time > 0) {
        let diff = new Date().getTime() - new_sheet_start_time;
        new_sheet_start_time = 0;

        if (diff >= 500) {
          const chitProps = { left: e.clientX, top: e.clientY - topOffset, title: `Chit ${all_chits.length + 1}`, topicId: selected_topic?.id };
          addChit(chitProps, async (element) => {
            element.focus();
            const newChitId = await AddChit(element.chit.props);
            console.log(element);
            element.setId(newChitId);
            console.log(`New Chit Id : ${newChitId}`);

            all_chits.push(element);
            selected_chit = element;
          });
        }
      } else {
        if (selected_chit) {
          UpdateChit(selected_chit.chit.id, selected_chit.chit.props);
        }
      }
    }
  };

  let timer;
  const sheetMouseMove = (e) => {
    e.stopPropagation();
    const xDragFactor = e.clientX - initCord.x;
    const yDragFactor = e.clientY - initCord.y;
    const factor = { left: xDragFactor, top: yDragFactor };
    initCord = { x: e.clientX, y: e.clientY };

    all_chits.forEach((chit) => {
      chit.drag(factor);
    });

    if (timer) clearInterval(timer);
    timer = setTimeout(() => {
      const updateChits = [];
      all_chits.forEach(({ chit }) => {
        updateChits.push({
          chitId: chit.id,
          props: chit.props,
        });
      });
      UpdateAllChits(updateChits);
    }, 700);

    // document.dispatchEvent(new CustomEvent(Events.ON_SHEET_DRAG, { detail: { factor } }));
  };

  const cheetSheetMouseMove = (e) => {
    e.stopPropagation();
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

    if (selected_chit) selected_chit.order("auto");
    selected_chit = all_chits.find(({ chit }) => chit.id === e.currentTarget.dataset.id);
    selected_chit.order(all_chits.length);
  };

  const chitArchive = (e) => {
    const { chit } = all_chits.find(({ chit }) => chit.id == e.detail.id);
    UpdateChit(chit.id, { ...chit.props, archive: true });
  };

  const addChit = (chitProps, callback) => {
    const chit = ChitMgmt({ ...chitProps, scale: selected_topic.scale });
    const { dom } = chit.chit;
    sheet.append(dom);
    cursorDefault();
    dom.addEventListener("mousedown", chitMouseDown);
    dom.addEventListener(Events.CONTENT_SAVE, chitContentChange);
    dom.addEventListener(Events.ARCHIVE, chitArchive);
    callback(chit);
  };

  const chitContentChange = () => {
    UpdateChit(selected_chit.chit.id, selected_chit.chit.props);
  };

  const build_sheet = () => {
    const sheetDom = Utils.newElem("div", "sheet");
    sheetDom.addEventListener("mousedown", sheetMouseDown);
    sheetDom.addEventListener("mouseup", sheetMouseUp);
    sheetDom.style.height = window.innerHeight - topOffset;
    return sheetDom;
  };

  const renderOldChits = async () => {
    // Flush previously loaded sheets
    if (selected_topic) {
      all_chits.forEach((chit) => {
        chit.remove();
      });

      all_chits.splice(0, all_chits.length);

      const chits = await LoadChits(selected_topic.id);
      if (chits) {
        chits.forEach((chit) => {
          addChit(chit, (element) => {
            all_chits.push(element);
          });
        });
      }
    }
  };

  const onTopicSelect = (e) => {
    selected_topic = e.detail.topic;

    document.dispatchEvent(new CustomEvent(Events.UPDATE_ZOOM, { detail: { scale: selected_topic.scale } }));
    if (selected_topic) renderOldChits();
  };

  const documentKeyPress = (e) => {
    if (e.code === "Escape") {
      cursorDefault();
      removeGroupHandler();
    }
  };

  const cursorDefault = () => {
    sheet.style.cursor = "default";
    actionAddChit = false;
  };

  const btnAddSelect = (e) => {
    sheet.style.cursor = "crosshair";
    actionAddChit = true;
  };

  const removeGroupHandler = (topic) => {
    if (topic && topic.id) {
      document.dispatchEvent(new CustomEvent(Events.RENDER_TOPIC, { detail: { topic } }));
    } else {
      moveChits(false);
    }

    if (newTopic) {
      document.body.removeChild(newTopic.dom);
      newTopic = null;
    }
  };

  const moveChits = (away = false) => {
    const sheetRect = sheet.getBoundingClientRect();

    // Move all chits away
    all_chits.forEach(({ chit }) => {
      chit.dom.style.transition = "left .3s, top .3s";
      if (away) {
        let { left, top, width, height, bottom, right } = chit.dom.getBoundingClientRect();
        bottom = sheetRect.height - bottom + topOffset;
        right = sheetRect.width - right;

        let lowestPath = Math.min(left, top - topOffset, bottom, right);

        if (lowestPath === left) chit.dom.style.left = 0 - (width - topOffset) + "px";
        if (lowestPath === top - topOffset) chit.dom.style.top = 0 - (height - topOffset) + "px";
        if (lowestPath === right) chit.dom.style.left = sheetRect.width - topOffset + "px";
        if (lowestPath === bottom) chit.dom.style.top = sheetRect.height - topOffset + "px";
      } else {
        chit.dom.style.left = chit.props.left;
        chit.dom.style.top = chit.props.top;
      }
    });
  };

  const onTopicAdd = (e) => {
    moveChits(true);

    newTopic = NewTopic({ close: removeGroupHandler });
    document.body.append(newTopic.dom);
  };

  const onScroll = (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      selected_topic.scale += e.deltaY * -0.0008;

      all_chits.forEach((chit) => {
        chit.scale({ clientX: e.clientX, clientY: e.clientY, new_scale: selected_topic.scale });
      });

      if (timer) clearInterval(timer);
      timer = setTimeout(() => {
        const updateChits = [];
        all_chits.forEach(({ chit }) => {
          updateChits.push({
            chitId: chit.id,
            props: chit.props,
          });
        });
        UpdateAllChits(updateChits);

        // Update topic at db level
        document.dispatchEvent(new CustomEvent(Events.UPDATE_TOPIC, { detail: { ...selected_topic, scale: selected_topic.scale } }));
      }, 700);

      // Updates zoom scale on the toolbar
      document.dispatchEvent(new CustomEvent(Events.UPDATE_ZOOM, { detail: { scale: selected_topic.scale } }));
    }
  };

  const onZoom = (e) => {
    const new_scale = e.detail.percent / 100;
    if (selected_topic) {
      // Save zoom level to topics
      selected_topic.scale = new_scale;
      document.dispatchEvent(new CustomEvent(Events.UPDATE_TOPIC, { detail: { ...selected_topic, scale: selected_topic.scale } }));

      // Re-scale chits
      all_chits.forEach((chit) => {
        const { width, height } = sheet.getBoundingClientRect();
        chit.scale({ clientX: width / 2, clientY: height / 2, new_scale, source: true });
      });
    }
  };

  const sheet = build_sheet();
  document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);
  document.addEventListener(Events.BTN_ADD_SELECT, btnAddSelect);
  document.addEventListener(Events.BTN_ADD_TOPIC, onTopicAdd);
  document.addEventListener("keydown", documentKeyPress);
  document.addEventListener("mousewheel", onScroll, { passive: false });
  document.addEventListener(Events.ON_ZOOM, onZoom);

  setTimeout(() => {
    console.log(`Orientation adjusted...`);
    let toolbar_offset = Utils.getDomById("toolbar").clientHeight;
    let chit_topics = Utils.getDomById("chit-topics").clientHeight;
    topOffset = toolbar_offset + chit_topics;
    sheet.style.height = window.innerHeight - topOffset;
  }, 10 * 1000);

  return sheet;
}

export { Sheet as default };
