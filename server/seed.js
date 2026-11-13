// Environment variables (MONGO_URI, JWT_SECRET, PORT) are loaded by Node itself
// via `--env-file=.env` in the npm scripts, so no dotenv package is needed.

import bcrypt from "bcrypt";
import User from "./models/User.js";
import Branch from "./models/Branch.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import connectDB from "./db/connection.js";

const NEPAL_BRANCHES = [
  { name: "Kathmandu Central", city: "Kathmandu", address: "New Road, Kathmandu", phone: "01-4223344", latitude: 27.7172, longitude: 85.3240 },
  { name: "Lalitpur Warehouse", city: "Lalitpur", address: "Pulchowk, Lalitpur", phone: "01-5523344", latitude: 27.6710, longitude: 85.3245 },
  { name: "Bhaktapur Outlet", city: "Bhaktapur", address: "Durbar Square Road, Bhaktapur", phone: "01-6613344", latitude: 27.6710, longitude: 85.4298 },
  { name: "Pokhara Branch", city: "Pokhara", address: "Lakeside, Pokhara", phone: "061-465544", latitude: 28.2096, longitude: 83.9856 },
  { name: "Bharatpur Depot", city: "Bharatpur", address: "Narayangarh, Bharatpur", phone: "056-524466", latitude: 27.6770, longitude: 84.4340 },
  { name: "Biratnagar Branch", city: "Biratnagar", address: "Main Road, Biratnagar", phone: "021-525566", latitude: 26.4525, longitude: 87.2718 },
  { name: "Birgunj Warehouse", city: "Birgunj", address: "Adarshanagar, Birgunj", phone: "051-522244", latitude: 27.0104, longitude: 84.8770 },
  { name: "Butwal Outlet", city: "Butwal", address: "Traffic Chowk, Butwal", phone: "071-544433", latitude: 27.7000, longitude: 83.4486 },
  { name: "Dharan Branch", city: "Dharan", address: "Bhanu Chowk, Dharan", phone: "025-520011", latitude: 26.8065, longitude: 87.2846 },
  { name: "Nepalgunj Depot", city: "Nepalgunj", address: "Surkhet Road, Nepalgunj", phone: "081-521144", latitude: 28.0500, longitude: 81.6167 },
];


// ---------------------------------------------------------------------
// DEMO INVENTORY — realistic dummy data so the warehouse, low-stock, and
// shipment views have something meaningful to show. It lives in MongoDB
// like real data would, so replacing it later means deleting these
// documents, not changing any code. Only seeded into an empty collection.
// ---------------------------------------------------------------------
const CATALOG = {
  LAPTOP: { productName: "Dell Inspiron 15 Laptop", description: "15.6-inch laptop, 16GB RAM, 512GB SSD", category: "Electronics", price: 750, costPrice: 600, minStock: 5, supplier: "Dell Nepal" },
  PHONE: { productName: "Smartphone Pro X", description: "6.5-inch OLED smartphone, 128GB", category: "Electronics", price: 599, costPrice: 450, minStock: 5, supplier: "TechSource Nepal" },
  HEADPHONES: { productName: "Wireless Headphones", description: "Over-ear Bluetooth headphones with noise cancelling", category: "Accessories", price: 60, costPrice: 35, minStock: 10, supplier: "SoundHub" },
  CHAIR: { productName: "Office Chair Deluxe", description: "Ergonomic office chair with lumbar support", category: "Furniture", price: 150, costPrice: 95, minStock: 5, supplier: "Himalayan Furniture" },
  JACKET: { productName: "Women's Denim Jacket", description: "Classic fit denim jacket", category: "Accessories", price: 45, costPrice: 25, minStock: 8, supplier: "Urban Wear Co." },
  POWERBANK: { productName: "USB-C Power Bank 20000mAh", description: "Fast-charging portable battery pack", category: "Accessories", price: 35, costPrice: 20, minStock: 10, supplier: "TechSource Nepal" },
  PRINTER: { productName: "A4 Laser Printer", description: "Monochrome laser printer with Wi-Fi", category: "Office Supplies", price: 220, costPrice: 160, minStock: 3, supplier: "Office Mart" },
  KEYBOARD: { productName: "Mechanical Keyboard", description: "Tenkeyless mechanical keyboard, blue switches", category: "Accessories", price: 80, costPrice: 50, minStock: 8, supplier: "TechSource Nepal" },
};

// branch name -> { catalog key: units on hand }. Several entries sit at or
// below their minimum on purpose, so low-stock alerts have real cases.
const STOCK_BY_BRANCH = {
  "Kathmandu Central": { LAPTOP: 25, HEADPHONES: 42, CHAIR: 8, JACKET: 30, KEYBOARD: 18 },
  "Lalitpur Warehouse": { LAPTOP: 10, HEADPHONES: 5, CHAIR: 31, POWERBANK: 60, PRINTER: 12 },
  "Pokhara Branch": { PHONE: 14, HEADPHONES: 22, JACKET: 4, POWERBANK: 3, KEYBOARD: 9 },
  "Biratnagar Branch": { LAPTOP: 3, PHONE: 20, CHAIR: 2, PRINTER: 2 },
};

const SKU_PREFIX = { LAPTOP: "LAP", PHONE: "PHN", HEADPHONES: "HDP", CHAIR: "CHR", JACKET: "JKT", POWERBANK: "PWR", PRINTER: "PRN", KEYBOARD: "KBD" };

// from-branch, destination, customer, status, payment, days ago, [catalog key, qty]
const DEMO_ORDERS = [
  ["Kathmandu Central", "Thamel, Kathmandu", "Sita Sharma", "Delivered", "Paid", 38, [["LAPTOP", 1], ["HEADPHONES", 2]]],
  ["Lalitpur Warehouse", "Butwal Bazaar, Butwal", "Ram Bahadur Thapa", "Shipped", "Paid", 6, [["CHAIR", 4], ["POWERBANK", 10]]],
  ["Pokhara Branch", "Lakeside, Pokhara", "Maya Gurung", "Processing", "Pending", 3, [["PHONE", 2]]],
  ["Biratnagar Branch", "Dharan Chowk, Dharan", "Bikash Rai", "Pending", "Pending", 1, [["PRINTER", 1], ["CHAIR", 1]]],
  ["Kathmandu Central", "Durbar Marg, Kathmandu", "Anita Shrestha", "Delivered", "Paid", 21, [["JACKET", 3], ["KEYBOARD", 2]]],
  ["Lalitpur Warehouse", "Bharatpur, Chitwan", "Prakash Adhikari", "Cancelled", "Failed", 12, [["LAPTOP", 2]]],
  ["Kathmandu Central", "Pulchowk, Lalitpur", "Sunita Koirala", "Delivered", "Paid", 55, [["HEADPHONES", 5], ["KEYBOARD", 5]]],
];

const seed = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env");
    }

    await connectDB();

    // --- Admin user ---
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        address: "Kathmandu, Nepal",
        role: "admin",
      });
      console.log(`✅ Admin user created (${adminEmail})`);
    } else {
      console.log("ℹ️  Admin already exists, skipping");
    }

    // --- Demo branches (Nepal) ---
    const existingBranchCount = await Branch.countDocuments();
    if (existingBranchCount === 0) {
      await Branch.insertMany(
        NEPAL_BRANCHES.map((b) => ({ ...b, status: "active", isDemo: true }))
      );
      console.log(`✅ Seeded ${NEPAL_BRANCHES.length} demo Nepal branches`);
    } else {
      console.log("ℹ️  Branches already exist, skipping branch seed");
    }


    // --- Demo accounts for each role (so access control can be tried) ---
    for (const demo of [
      { name: "Demo Staff", email: "staff@gmail.com", password: process.env.DEMO_STAFF_PASSWORD, role: "user" },
      { name: "Demo Customer", email: "customer@gmail.com", password: process.env.DEMO_CUSTOMER_PASSWORD, role: "customer" },
    ]) {
      if (!demo.password) continue;

      if (!(await User.findOne({ email: demo.email }))) {
        await User.create({
          name: demo.name,
          email: demo.email,
          password: await bcrypt.hash(demo.password, 10),
          address: "Kathmandu, Nepal",
          role: demo.role,
        });
        console.log(`✅ ${demo.role} demo user created (${demo.email})`);
      }
    }

    // --- Demo products, split across warehouses ---
    if ((await Product.countDocuments()) === 0) {
      const branches = await Branch.find();
      const byName = Object.fromEntries(branches.map((b) => [b.name, b]));
      const docs = [];
      for (const [branchName, items] of Object.entries(STOCK_BY_BRANCH)) {
        const branch = byName[branchName];
        if (!branch) continue;
        for (const [key, stock] of Object.entries(items)) {
          docs.push({
            ...CATALOG[key],
            stock,
            branch: branch._id,
            sku: `${SKU_PREFIX[key]}-${branch.city.slice(0, 3).toUpperCase()}`,
          });
        }
      }
      await Product.insertMany(docs);
      console.log(`✅ Seeded ${docs.length} demo products across ${Object.keys(STOCK_BY_BRANCH).length} warehouses`);
    } else {
      console.log("ℹ️  Products already exist, skipping product seed");
    }

    // --- Demo orders (these double as shipments in the admin Inventory view) ---
    if ((await Order.countDocuments()) === 0 && (await Product.countDocuments()) > 0) {
      const branches = await Branch.find();
      const byName = Object.fromEntries(branches.map((b) => [b.name, b]));
      for (const [from, to, customer, orderStatus, paymentStatus, daysAgo, lines] of DEMO_ORDERS) {
        const branch = byName[from];
        if (!branch) continue;
        const products = [];
        for (const [key, quantity] of lines) {
          const product = await Product.findOne({ branch: branch._id, productName: CATALOG[key].productName });
          if (product) products.push({ product: product._id, quantity, price: product.price });
        }
        if (products.length === 0) continue;
        await Order.create({
          customer,
          products,
          totalAmount: products.reduce((sum, p) => sum + p.quantity * p.price, 0),
          orderStatus,
          paymentStatus,
          shippingAddress: to,
          branch: branch._id,
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
        });
      }
      console.log(`✅ Seeded ${DEMO_ORDERS.length} demo orders`);
    } else {
      console.log("ℹ️  Orders already exist (or no products), skipping order seed");
    }

    console.log("Seed complete.");
    process.exit(0);
  } catch (error) {
    console.error("SEED ERROR:", error);
    process.exit(1);
  }
};

seed();
