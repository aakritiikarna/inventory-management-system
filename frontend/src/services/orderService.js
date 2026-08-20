import API from "../api/api";

export const getOrders = () =>
  API.get("/orders");

export const getOrder = (id) =>
  API.get(`/orders/${id}`);

export const createOrder = (data) =>
  API.post("/orders", data);

export const updateOrder = (id, data) =>
  API.put(`/orders/${id}`, data);

export const deleteOrder = (id) =>
  API.delete(`/orders/${id}`);