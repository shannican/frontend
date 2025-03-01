import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:9000/api",
  baseURL: "https://backend-bcuq.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;

