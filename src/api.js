import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Token " + token;
  }
  return config;
});

export function errorText(err) {
  const data = err.response && err.response.data;
  if (!data) {
    return "Could not reach the server. Check that the API is running.";
  }
  if (typeof data === "string") {
    return data;
  }
  if (data.detail) {
    return data.detail;
  }
  const key = Object.keys(data)[0];
  const value = data[key];
  if (Array.isArray(value)) {
    return key + ": " + value[0];
  }
  if (typeof value === "string") {
    return key + ": " + value;
  }
  return "Please check the form and try again.";
}

export default api;
