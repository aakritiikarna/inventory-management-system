import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pos-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("pos-user");
      localStorage.removeItem("pos-token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;