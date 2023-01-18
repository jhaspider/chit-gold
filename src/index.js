import Sheet from "./components/sheet";
import Toolbar from "./components/Toolbar";
import Topics from "./components/topics";
import Utils from "./utils/utils.js";

const workarea = Utils.getDomById("workarea");
workarea.append(Topics());
workarea.append(Sheet());
workarea.append(Toolbar());
