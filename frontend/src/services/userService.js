import API from "../api/api";

export const getUsers = () =>
  API.get("/users");

export const createUser = (data) =>
  API.post("/users", data);

export const updateUser = (id, data) =>
  API.put(`/users/${id}`, data);

export const deleteUser = (id) =>
  API.delete(`/users/${id}`);