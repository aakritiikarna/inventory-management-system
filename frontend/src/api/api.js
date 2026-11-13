import axios from "axios";
import { API_BASE_URL } from "./config";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach JWT token, and only force JSON content-type when
// the request body isn't FormData (image uploads need the browser to set
// their own multipart boundary).
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pos-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
API.interceptors.response.use(
  (response) => response,

  (error) => {
    // Only treat a 401 as "your session is invalid" if this request
    // actually carried a token. An anonymous request (e.g. fired before
    // login) coming back 401 *after* a fresh login must not wipe the new
    // session — that was the cause of the dashboard flashing then
    // bouncing back to /login.
    const hadToken = Boolean(error.config?.headers?.Authorization);

    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem("pos-user");
      localStorage.removeItem("pos-token");

      // Avoid a redundant reload if we're already on /login — repeatedly
      // hard-reloading the same page is what produces a visible "blink"
      // if multiple requests 401 in quick succession (e.g. several
      // dashboard widgets firing at once with a stale token).
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
