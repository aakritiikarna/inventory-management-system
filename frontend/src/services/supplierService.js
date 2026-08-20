import API from "../api/api";

export const getSuppliers = () =>
  API.get("/suppliers");

export const createSupplier = (data) =>
  API.post("/suppliers", data);

export const updateSupplier = (id, data) =>
  API.put(`/suppliers/${id}`, data);

export const deleteSupplier = (id) =>
  API.delete(`/suppliers/${id}`);