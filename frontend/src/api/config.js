export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");

export const BACKEND_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;
