import Sheet from "./components/sheet";
import Topics from "./components/topics";
import Utils from "./utils/utils.js";

const workarea = Utils.getDomById("workarea");
workarea.append(Topics());
workarea.append(Sheet());
