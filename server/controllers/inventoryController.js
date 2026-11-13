import Branch from "../models/Branch.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const stockLevel = (stock, minStock) => {
  const min = minStock ?? 5;
  if ((stock || 0) <= 0) return "out";
  if (stock <= min) return "low";
  return "ok";
};

// ===============================
// WAREHOUSE-LEVEL INVENTORY
// GET /api/inventory/warehouses   (admin only)
// Groups real products by the branch/warehouse that holds them, so the
// admin can see what each location has, how much, and where stock is low.
// Products with no branch are returned separately instead of being hidden.
// ===============================
export const getWarehouseInventory = async (req, res) => {
  try {
    const [branches, products] = await Promise.all([
      Branch.find().sort({ name: 1 }).lean(),
      Product.find().lean(),
    ]);

    const toRow = (p) => ({
      _id: p._id,
      productName: p.productName,
      sku: p.sku,
      category: p.category,
      image: p.image,
      price: p.price,
      stock: p.stock || 0,
      minStock: p.minStock ?? 5,
      level: stockLevel(p.stock, p.minStock),
    });

    const summarize = (rows) => ({
      totalUnits: rows.reduce((s, r) => s + r.stock, 0),
      inventoryValue: rows.reduce((s, r) => s + r.stock * (r.price || 0), 0),
      lowStockCount: rows.filter((r) => r.level === "low").length,
      outOfStockCount: rows.filter((r) => r.level === "out").length,
      productCount: rows.length,
    });

    const byBranch = new Map(branches.map((b) => [String(b._id), []]));
    const unassigned = [];

    products.forEach((p) => {
      const key = p.branch ? String(p.branch) : null;
      if (key && byBranch.has(key)) byBranch.get(key).push(toRow(p));
      else unassigned.push(toRow(p));
    });

    const warehouses = branches.map((b) => {
      const rows = byBranch.get(String(b._id)).sort((a, c) => a.stock - c.stock);
      return {
        _id: b._id,
        name: b.name,
        city: b.city,
        address: b.address,
        status: b.status,
        ...summarize(rows),
        products: rows,
      };
    });

    res.status(200).json({
      success: true,
      warehouses,
      unassigned: { ...summarize(unassigned), products: unassigned },
    });
  } catch (error) {
    console.error("WAREHOUSE INVENTORY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// SHIPMENTS
// GET /api/inventory/shipments   (admin only)
// There is no separate shipment collection: an order that is fulfilled
// from a branch IS the shipment. From = the order's branch/warehouse,
// To = the order's shipping address, items = the order's products, and
// status = the order's status. Derived from real orders, not mock data.
// ===============================
export const getShipments = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("branch", "name city")
      .populate("products.product", "productName sku image category")
      .lean();

    const shipments = orders.map((o) => {
      const items = (o.products || []).map((p) => ({
        name: p.product?.productName || "Removed product",
        sku: p.product?.sku || "",
        category: p.product?.category,
        image: p.product?.image,
        quantity: p.quantity || 0,
      }));
      return {
        _id: o._id,
        reference: String(o._id).slice(-8).toUpperCase(),
        from: o.branch ? { name: o.branch.name, city: o.branch.city } : null,
        to: o.shippingAddress || "",
        customer: o.customer,
        items,
        totalUnits: items.reduce((s, i) => s + i.quantity, 0),
        status: o.orderStatus,
        createdAt: o.createdAt,
      };
    });

    res.status(200).json({ success: true, shipments });
  } catch (error) {
    console.error("SHIPMENTS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
