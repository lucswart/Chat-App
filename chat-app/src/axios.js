import axios from "axios";

const instance = axios.create({
  baseURL: "https://secure-temple-48473.herokuapp.com/",
});

export default instance;
