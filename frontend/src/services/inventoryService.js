import API from "../api/api";

// Admin-only endpoints (the API returns 403 for everyone else).
export const getWarehouseInventory = () => API.get("/inventory/warehouses");
export const getShipments = () => API.get("/inventory/shipments");
