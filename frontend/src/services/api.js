// Re-exported so both `services/api` and `api/api` import paths resolve to
// the same axios instance. The canonical implementation lives in `src/api/api.js`.
export { default } from "../api/api";
