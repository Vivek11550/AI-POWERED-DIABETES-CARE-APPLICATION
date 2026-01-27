import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.15:5000/api",
  timeout: 10000,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default API;
