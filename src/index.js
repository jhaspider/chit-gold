import Sheet from "./components/sheet";
import Utils from "./utils/utils.js";

const App = () => {
  return Sheet();
};

const workarea = Utils.getDomById("workarea");
workarea.append(App());
