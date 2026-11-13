// Spins up the real routers + real JWT verification; only the DB layer is stubbed.
process.env.JWT_SECRET = "test-secret";
import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Branch from "./models/Branch.js";
import Order from "./models/Order.js";
import Supplier from "./models/Supplier.js";
import Category from "./models/Category.js";

const users = {
  a: { _id: "a", name: "Admin", role: "admin" },
  u: { _id: "u", name: "Staff", role: "user" },
  c: { _id: "c", name: "Cust", role: "customer" },
};
User.findById = (id) => ({ select: async () => users[id] || null });

const prod = { _id: "p1", productName: "Dell Inspiron", sku: "L1", description: "d", category: "Electronics",
  price: 750, costPrice: 500, stock: 3, minStock: 5, supplier: "Dell", image: "", branch: { name: "Kathmandu" },
  toObject() { const { toObject, ...r } = this; return r; } };
const chain = (data) => { const c = { populate: () => c, sort: () => c, select: () => c, limit: () => c, then: (r) => r(data) }; return c; };
Product.find = () => chain([prod]);
Branch.find = () => chain([{ name: "B" }]);
Order.find = () => chain([]);
Supplier.find = () => chain([]);
Category.find = () => chain([{ name: "Electronics" }]);

const { default: productRoutes } = await import("./routes/productRoutes.js");
const { default: branchRoutes } = await import("./routes/branch.js");
const { default: orderRoutes } = await import("./routes/order.js");
const { default: supplierRoutes } = await import("./routes/supplierRoutes.js");
const { default: categoryRoutes } = await import("./routes/categoryRoutes.js");
const { default: authRoutes } = await import("./routes/auth.js");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
const server = app.listen(0);
const base = `http://localhost:${server.address().port}`;
const tok = (id) => jwt.sign({ id }, "test-secret");

let pass = 0, fail = 0;
const check = async (label, method, path, who, expectStatus, extra, requestBody = {}) => {
  const res = await fetch(base + path, { method, headers: { "Content-Type": "application/json", ...(who ? { Authorization: `Bearer ${tok(who)}` } : {}) }, body: method !== "GET" ? JSON.stringify(requestBody) : undefined });
  const body = await res.json().catch(() => ({}));
  let ok = res.status === expectStatus;
  if (ok && extra) ok = extra(body);
  console.log(ok ? "PASS" : "FAIL", label.padEnd(58), res.status);
  ok ? pass++ : fail++;
};

await check("no token -> /products", "GET", "/api/products", null, 401);
await check("admin GET /products sees stock+cost+branch", "GET", "/api/products", "a", 200,
  (b) => b.products[0].stock === 3 && b.products[0].costPrice === 500 && b.products[0].branch);
await check("staff GET /products: NO stock/cost/branch/supplier", "GET", "/api/products", "u", 200,
  (b) => !("stock" in b.products[0]) && !("costPrice" in b.products[0]) && !("branch" in b.products[0]) && !("supplier" in b.products[0]) && b.products[0].inStock === true);
await check("customer GET /products sanitized", "GET", "/api/products", "c", 200, (b) => !("stock" in b.products[0]));
await check("staff POST /products forbidden", "POST", "/api/products", "u", 403);
await check("customer DELETE /products/x forbidden", "DELETE", "/api/products/x", "c", 403);
await check("admin GET /branches ok", "GET", "/api/branches", "a", 200);
await check("staff GET /branches forbidden", "GET", "/api/branches", "u", 403);
await check("customer GET /branches/analytics forbidden", "GET", "/api/branches/analytics", "c", 403);
await check("staff GET /orders forbidden", "GET", "/api/orders", "u", 403);
await check("admin GET /orders ok", "GET", "/api/orders", "a", 200);
await check("staff GET /suppliers forbidden", "GET", "/api/suppliers", "u", 403);
await check("staff POST /categories forbidden", "POST", "/api/categories", "u", 403);
await check("staff GET /categories allowed (names only)", "GET", "/api/categories", "u", 200);

const authUser = {
  _id: "a",
  name: "Admin",
  email: "admin@example.com",
  role: "admin",
  password: await bcrypt.hash("correct-password", 4),
  toObject() {
    return { _id: this._id, name: this.name, email: this.email, role: this.role, password: this.password };
  },
};
User.findOne = async ({ email }) => (email === authUser.email ? authUser : null);

await check("unknown login returns generic unauthorized response", "POST", "/api/auth/login", null, 401,
  (b) => b.message === "Invalid credentials",
  { email: "missing@example.com", password: "wrong-password" });
await check("incorrect password returns generic unauthorized response", "POST", "/api/auth/login", null, 401,
  (b) => b.message === "Invalid credentials",
  { email: authUser.email, password: "wrong-password" });
await check("login response never includes password hash", "POST", "/api/auth/login", null, 200,
  (b) => Boolean(b.token) && !("password" in b.user),
  { email: authUser.email, password: "correct-password" });

let createdProduct;
Product.create = async (product) => {
  createdProduct = product;
  return product;
};
await check("product creation preserves zero cost and stock thresholds", "POST", "/api/products", "a", 201,
  () => createdProduct.costPrice === 0 && createdProduct.minStock === 0,
  {
    productName: "Zero-valued configuration test",
    description: "Test product",
    price: 10,
    stock: 1,
    minStock: 0,
    costPrice: 0,
    category: "Test",
    supplier: "Test",
  });

console.log(`\n${pass} passed, ${fail} failed`);
server.close();
process.exit(fail ? 1 : 0);
