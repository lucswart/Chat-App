import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000", //"https://chat-appsss.herokuapp.com/" ||
});

export default instance;
