import axios from "axios";

const API = axios.create({
  baseURL:process.env.EXPO_PUBLIC_API_URL,
  timeout: 100000,
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default API;
