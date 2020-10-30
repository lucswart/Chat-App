import axios from "axios";

const instance = axios.create({
  baseURL: "https://chat-appsss.herokuapp.com/",
});

export default instance;
