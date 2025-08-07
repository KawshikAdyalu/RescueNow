import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api" // change if using different backend URL
});

export default api;
