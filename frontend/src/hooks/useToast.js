import toast from "react-hot-toast";

/**
 * Thin wrapper around react-hot-toast so the rest of the app imports
 * one consistent API (and we can change the toast library later
 * without touching every page).
 */
export function useToast() {
  return {
    success: (msg) => toast.success(msg),
    error: (msg) => toast.error(msg),
    info: (msg) => toast(msg),
    promise: (promise, messages) => toast.promise(promise, messages),
  };
}

/** Extracts a readable message from a DRF error response. */
export function extractErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) return "Something went wrong. Please try again.";
  if (typeof data === "string") return data;
  if (data.detail) return Array.isArray(data.detail) ? data.detail.join(" ") : data.detail;
  // DRF field errors: { field: ["msg1", "msg2"], ... }
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    const msg = Array.isArray(val) ? val[0] : val;
    return `${firstKey}: ${msg}`;
  }
  return "Something went wrong. Please try again.";
}
