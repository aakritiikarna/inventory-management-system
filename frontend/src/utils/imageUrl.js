import { BACKEND_ORIGIN } from "../api/config";

export { BACKEND_ORIGIN };

// Builds a full URL for an image path returned by the API (e.g. "/uploads/products/xyz.jpg").
// Returns null when there's nothing to show so callers can render a fallback.
export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
};
