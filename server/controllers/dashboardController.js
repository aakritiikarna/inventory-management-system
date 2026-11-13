import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";
import Branch from "../models/Branch.js";
import Supplier from "../models/Supplier.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// Percentage change helper. Returns null (not 0) when there's nothing to
// compare against, so the frontend can show "—" instead of a misleading 0%.
const percentChange = (current, previous) => {
  if (!previous) return current > 0 ? null : 0;
  return ((current - previous) / previous) * 100;
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalProducts,
      totalCustomers,
      activeUsers,
      totalOrders,
      totalBranches,
      totalSuppliers,
      orders,
      products,
      categories,
      users,
    ] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments(),
      Order.countDocuments(),
      Branch.countDocuments(),
      Supplier.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(500).populate({
        path: "products.product",
        select: "productName image category costPrice",
      }),
      Product.find().populate({ path: "branch", select: "name city" }),
      Category.find(),
      User.find().select("createdAt role").sort({ createdAt: 1 }),
    ]);

    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    // Real profit — only counted for line items whose product actually has
    // a costPrice on record. Products without a cost simply contribute 0
    // profit rather than an invented margin.
    const profitForOrder = (order) =>
      order.products.reduce((sum, item) => {
        if (!item.product || item.product.costPrice == null) return sum;
        const margin = (item.price ?? 0) - item.product.costPrice;
        return sum + margin * (item.quantity || 0);
      }, 0);

    const totalProfit = orders.reduce((sum, o) => sum + profitForOrder(o), 0);
    const hasCostData = products.some((p) => p.costPrice != null);

    const inventoryValue = products.reduce(
      (sum, p) => sum + p.price * p.stock,
      0
    );

    const lowStockItems = products.filter(
      (p) => p.stock <= (p.minStock ?? 5)
    );

    // Total units on hand, and how they're distributed across warehouses.
    // Computed from the same products already loaded above — no extra query.
    const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

    const warehouseMap = {};
    products.forEach((p) => {
      const key = p.branch?._id ? String(p.branch._id) : "unassigned";
      if (!warehouseMap[key]) {
        warehouseMap[key] = {
          name: p.branch?.name || "Unassigned",
          city: p.branch?.city || "",
          units: 0,
          products: 0,
          lowStockCount: 0,
        };
      }
      warehouseMap[key].units += p.stock || 0;
      warehouseMap[key].products += 1;
      if (p.stock <= (p.minStock ?? 5)) warehouseMap[key].lowStockCount += 1;
    });
    const warehouseStock = Object.values(warehouseMap).sort((a, b) => b.units - a.units);

    // ---- Period-over-period comparison (last 30 days vs the 30 before) ----
    const now = Date.now();
    const periodStart = new Date(now - 30 * DAY_MS);
    const prevPeriodStart = new Date(now - 60 * DAY_MS);

    const currentPeriodOrders = orders.filter((o) => o.createdAt >= periodStart);
    const prevPeriodOrders = orders.filter(
      (o) => o.createdAt >= prevPeriodStart && o.createdAt < periodStart
    );

    const currentRevenue = currentPeriodOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const prevRevenue = prevPeriodOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    const currentProfit = currentPeriodOrders.reduce((s, o) => s + profitForOrder(o), 0);
    const prevProfit = prevPeriodOrders.reduce((s, o) => s + profitForOrder(o), 0);

    const currentNewCustomers = users.filter(
      (u) => u.role === "customer" && u.createdAt >= periodStart
    ).length;
    const prevNewCustomers = users.filter(
      (u) => u.role === "customer" && u.createdAt >= prevPeriodStart && u.createdAt < periodStart
    ).length;

    const periodStats = {
      revenueChange: percentChange(currentRevenue, prevRevenue),
      ordersChange: percentChange(currentPeriodOrders.length, prevPeriodOrders.length),
      profitChange: percentChange(currentProfit, prevProfit),
      newCustomers: currentNewCustomers,
      newCustomersChange: percentChange(currentNewCustomers, prevNewCustomers),
    };

    // ---- Daily trend arrays (last 14 active days) for sparklines + charts ----
    const revenueMap = {};
    const ordersMap = {};
    const profitMap = {};
    orders.forEach((order) => {
      const day = order.createdAt.toISOString().slice(0, 10);
      revenueMap[day] = (revenueMap[day] || 0) + (order.totalAmount || 0);
      ordersMap[day] = (ordersMap[day] || 0) + 1;
      profitMap[day] = (profitMap[day] || 0) + profitForOrder(order);
    });
    const sortedDays = Object.keys(revenueMap).sort((a, b) => a.localeCompare(b)).slice(-14);

    const revenueTrend = sortedDays.map((date) => ({ date, revenue: revenueMap[date] }));
    const ordersTrend = sortedDays.map((date) => ({ date, orders: ordersMap[date] || 0 }));
    const profitTrend = sortedDays.map((date) => ({ date, profit: profitMap[date] || 0 }));

    // New users per month — real data from User.createdAt
    const userGrowthMap = {};
    users.forEach((u) => {
      const month = u.createdAt.toISOString().slice(0, 7); // YYYY-MM
      userGrowthMap[month] = (userGrowthMap[month] || 0) + 1;
    });
    const userGrowth = Object.entries(userGrowthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12)
      .map(([month, count]) => ({ month, users: count }));

    // Orders by status
    const statusCounts = {};
    orders.forEach((order) => {
      statusCounts[order.orderStatus] = (statusCounts[order.orderStatus] || 0) + 1;
    });

    // Category distribution by product count
    const categoryCounts = {};
    products.forEach((p) => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    // Top products by units sold across orders
    const unitsSold = {};
    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (!item.product) return;
        const id = String(item.product._id);
        if (!unitsSold[id]) {
          unitsSold[id] = {
            product: item.product,
            unitsSold: 0,
            revenue: 0,
          };
        }
        unitsSold[id].unitsSold += item.quantity || 0;
        unitsSold[id].revenue += (item.price || 0) * (item.quantity || 0);
      });
    });
    const topProducts = Object.values(unitsSold)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Non-admins get a deliberately minimal payload: catalog size and
    // category mix only. Revenue, profit, orders, customers, stock levels,
    // and branch data are internal and are never sent to their browser.
    if (req.user?.role !== "admin") {
      return res.status(200).json({
        success: true,
        restricted: true,
        stats: { totalProducts, categoriesCount: categories.length },
        periodStats: {},
        revenueTrend: [],
        ordersTrend: [],
        profitTrend: [],
        userGrowth: [],
        statusCounts: {},
        categoryCounts,
        topProducts: [],
        lowStockItems: [],
        recentOrders: [],
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCustomers,
        activeUsers,
        totalOrders,
        totalBranches,
        totalSuppliers,
        totalRevenue,
        totalProfit,
        hasCostData,
        inventoryValue,
        totalUnits,
        lowStockCount: lowStockItems.length,
        categoriesCount: categories.length,
      },
      periodStats,
      revenueTrend,
      ordersTrend,
      profitTrend,
      userGrowth,
      statusCounts,
      categoryCounts,
      topProducts,
      warehouseStock,
      lowStockItems: lowStockItems.slice(0, 10).map((p) => ({
        _id: p._id,
        productName: p.productName,
        stock: p.stock,
        minStock: p.minStock,
        image: p.image,
        category: p.category,
        branch: p.branch ? { _id: p.branch._id, name: p.branch.name, city: p.branch.city } : null,
      })),
      recentOrders: orders.slice(0, 8),
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Dashboard loading failed",
    });
  }
};
