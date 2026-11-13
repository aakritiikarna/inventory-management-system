import API from "../api/api";

export const getUsers = () => API.get("/users");

export const getUser = (id) => API.get(`/users/${id}`);

// data may be a plain object or a FormData instance (when uploading an
// avatar). API automatically skips forcing JSON headers for FormData.
export const createUser = (data) => API.post("/users", data);

export const updateUser = (id, data) => API.put(`/users/${id}`, data);

export const deleteUser = (id) => API.delete(`/users/${id}`);
