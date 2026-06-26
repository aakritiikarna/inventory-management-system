import axiosClient from "./axiosClient";

/* ---------------------------- Auth ---------------------------- */
export const authApi = {
  login: (username, password) =>
    axiosClient.post("/accounts/login/", { username, password }),
  register: (payload) => axiosClient.post("/accounts/register/", payload),
  logout: (refresh) => axiosClient.post("/accounts/logout/", { refresh }),
  getProfile: () => axiosClient.get("/accounts/profile/"),
  updateProfile: (payload) => axiosClient.patch("/accounts/profile/", payload),
  changePassword: (payload) => axiosClient.post("/accounts/change-password/", payload),
  listUsers: (params) => axiosClient.get("/accounts/users/", { params }),
  createUser: (payload) => axiosClient.post("/accounts/users/", payload),
  updateUser: (id, payload) => axiosClient.patch(`/accounts/users/${id}/`, payload),
  deleteUser: (id) => axiosClient.delete(`/accounts/users/${id}/`),
};

/* -------------------------- Suppliers -------------------------- */
export const supplierApi = {
  list: (params) => axiosClient.get("/suppliers/", { params }),
  get: (id) => axiosClient.get(`/suppliers/${id}/`),
  create: (payload) => axiosClient.post("/suppliers/", payload),
  update: (id, payload) => axiosClient.patch(`/suppliers/${id}/`, payload),
  remove: (id) => axiosClient.delete(`/suppliers/${id}/`),
};

/* -------------------------- Warehouses -------------------------- */
export const warehouseApi = {
  list: (params) => axiosClient.get("/warehouses/", { params }),
  get: (id) => axiosClient.get(`/warehouses/${id}/`),
  create: (payload) => axiosClient.post("/warehouses/", payload),
  update: (id, payload) => axiosClient.patch(`/warehouses/${id}/`, payload),
  remove: (id) => axiosClient.delete(`/warehouses/${id}/`),
};

/* --------------------------- Products --------------------------- */
export const productApi = {
  list: (params) => axiosClient.get("/products/", { params }),
  get: (id) => axiosClient.get(`/products/${id}/`),
  create: (payload) => axiosClient.post("/products/", payload),
  update: (id, payload) => axiosClient.patch(`/products/${id}/`, payload),
  remove: (id) => axiosClient.delete(`/products/${id}/`),
  listCategories: () => axiosClient.get("/products/categories/"),
  createCategory: (payload) => axiosClient.post("/products/categories/", payload),
};

/* ----------------------------- Stock ----------------------------- */
export const stockApi = {
  listItems: (params) => axiosClient.get("/stock/items/", { params }),
  updateItem: (id, payload) => axiosClient.patch(`/stock/items/${id}/`, payload),
  listTransactions: (params) => axiosClient.get("/stock/transactions/", { params }),
  createTransaction: (payload) => axiosClient.post("/stock/transactions/", payload),
  deleteTransaction: (id) => axiosClient.delete(`/stock/transactions/${id}/`),
};

/* ------------------------ Purchase Orders ------------------------ */
export const purchaseOrderApi = {
  list: (params) => axiosClient.get("/purchase-orders/", { params }),
  get: (id) => axiosClient.get(`/purchase-orders/${id}/`),
  create: (payload) => axiosClient.post("/purchase-orders/", payload),
  update: (id, payload) => axiosClient.patch(`/purchase-orders/${id}/`, payload),
  remove: (id) => axiosClient.delete(`/purchase-orders/${id}/`),
  approve: (id) => axiosClient.post(`/purchase-orders/${id}/approve/`),
  receive: (id) => axiosClient.post(`/purchase-orders/${id}/receive/`),
  cancel: (id) => axiosClient.post(`/purchase-orders/${id}/cancel/`),
};

/* ---------------------------- Reports ---------------------------- */
export const reportsApi = {
  dashboardSummary: () => axiosClient.get("/reports/dashboard/summary/"),
  stockMovement: (months = 6) =>
    axiosClient.get("/reports/dashboard/stock-movement/", { params: { months } }),
  purchaseTrends: (months = 6) =>
    axiosClient.get("/reports/dashboard/purchase-trends/", { params: { months } }),
  inventoryValue: () => axiosClient.get("/reports/dashboard/inventory-value/"),

  // Returns a blob for CSV/Excel exports; JSON (format=json/default) uses normal get.
  stockReport: (params) => axiosClient.get("/reports/stock/", { params }),
  supplierReport: (params) => axiosClient.get("/reports/suppliers/", { params }),
  warehouseReport: (params) => axiosClient.get("/reports/warehouses/", { params }),
  purchaseOrderReport: (params) => axiosClient.get("/reports/purchase-orders/", { params }),

  download: (path, params, filename) =>
    axiosClient
      .get(path, { params, responseType: "blob" })
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }),
};
