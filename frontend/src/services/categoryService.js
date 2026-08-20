import API from "../api/api";

export const getCategories = () =>
  API.get("/categories");

export const createCategory = (data) =>
  API.post("/categories", data);

export const updateCategory = (id, data) =>
  API.put(`/categories/${id}`, data);

export const deleteCategory = (id) =>
  API.delete(`/categories/${id}`);