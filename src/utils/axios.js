import axios from "axios";
import Utils from "./utils";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5001/cheat-sheet-62dad/asia-south1/",
  timeout: 3 * 1000,
});

instance.interceptors.request.use(
  function (config) {
    const uid = Utils.getUId();
    config.headers["x-cheat-user-id"] = uid;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default instance;
