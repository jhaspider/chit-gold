import axios from "axios";

import Utils from "./utils";

const instance = axios.create({
  baseURL: process.env.API_BASE_URL,
  timeout: 3 * 1000,
});

instance.interceptors.request.use(
  function (config) {
    const { uid } = Utils.getUId();
    config.headers["x-cheat-user-id"] = uid;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let data = null;
    try {
      data = error.response.data;
    } catch (e) {
      data = { status: false, msg: "Network Error" };
    }
    return Promise.reject(data);
  }
);

export default instance;
