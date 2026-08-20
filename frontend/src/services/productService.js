import API from "../api/api";

export const getProducts = () => API.get("/products");

export const getProduct = (id) =>
  API.get(`/products/${id}`);

export const createProduct = (data) =>
  API.post("/products", data);

export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);