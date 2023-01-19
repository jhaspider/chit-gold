import axios from "axios";

const uid = localStorage.getItem("cheat-user-id");

const instance = axios.create({
  baseURL: "http://127.0.0.1:5001/cheat-sheet-62dad/asia-south1/",
  timeout: 3 * 1000,
  headers: { "x-cheat-user-id": uid },
});

export default instance;
