import API from "../api/api";

export const getBranches = () => API.get("/branches");

export const getBranch = (id) => API.get(`/branches/${id}`);

export const getBranchAnalytics = () => API.get("/branches/analytics");

export const createBranch = (data) => API.post("/branches", data);

export const updateBranch = (id, data) => API.put(`/branches/${id}`, data);

export const deleteBranch = (id) => API.delete(`/branches/${id}`);
