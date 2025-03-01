import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://backend-bcuq.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

export default API;
