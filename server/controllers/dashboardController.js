import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();

    let totalRevenue = 0;

    orders.forEach((order) => {
      totalRevenue += order.totalAmount || 0;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCustomers,
        totalOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Dashboard loading failed",
    });
  }
};