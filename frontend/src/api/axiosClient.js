import axios from "axios";

/**
 * Central axios instance for all API calls.
 *
 * - Attaches the access token to every request automatically.
 * - On a 401 response (expired access token), transparently attempts
 *   a token refresh exactly once, then retries the original request.
 *   If the refresh itself fails, the user is logged out and redirected
 *   to /login.
 */

const axiosClient = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function resolvePending(newToken) {
  pendingQueue.forEach(({ resolve }) => resolve(newToken));
  pendingQueue = [];
}

function rejectPending(error) {
  pendingQueue.forEach(({ reject }) => reject(error));
  pendingQueue = [];
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      handleLogoutRedirect();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until the in-flight refresh finishes, so we
      // don't fire N parallel refresh calls if N requests 401 at once.
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newToken) => {
        config._retry = true;
        config.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(config);
      });
    }

    isRefreshing = true;
    try {
      const { data } = await axios.post("/api/accounts/login/refresh/", {
        refresh: refreshToken,
      });
      localStorage.setItem("access_token", data.access);
      resolvePending(data.access);
      config._retry = true;
      config.headers.Authorization = `Bearer ${data.access}`;
      return axiosClient(config);
    } catch (refreshError) {
      rejectPending(refreshError);
      handleLogoutRedirect();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function handleLogoutRedirect() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

export default axiosClient;
