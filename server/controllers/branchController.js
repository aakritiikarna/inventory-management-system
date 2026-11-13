import Branch from "../models/Branch.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// ===============================
// CREATE BRANCH
// ===============================
export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);

    res.status(201).json({
      success: true,
      message: "Branch created successfully",
      branch,
    });
  } catch (error) {
    console.error("CREATE BRANCH ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ===============================
// GET ALL BRANCHES
// ===============================
export const getBranches = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });
    res.status(200).json({ success: true, branches });
  } catch (error) {
    console.error("GET BRANCHES ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// GET SINGLE BRANCH
// ===============================
export const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    res.status(200).json({ success: true, branch });
  } catch (error) {
    console.error("GET BRANCH ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// UPDATE BRANCH
// ===============================
export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }

    res.status(200).json({ success: true, message: "Branch updated successfully", branch });
  } catch (error) {
    console.error("UPDATE BRANCH ERROR:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ===============================
// DELETE BRANCH
// ===============================
export const deleteBranch = async (req, res) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: "Branch not found" });
    }
    res.status(200).json({ success: true, message: "Branch deleted successfully" });
  } catch (error) {
    console.error("DELETE BRANCH ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===============================
// BRANCH PERFORMANCE / ANALYTICS
// GET /api/branches/analytics
// ===============================
export const getBranchAnalytics = async (req, res) => {
  try {
    const branches = await Branch.find().sort({ name: 1 });

    const results = await Promise.all(
      branches.map(async (branch) => {
        const [orderCount, inventoryAgg] = await Promise.all([
          Order.countDocuments({ branch: branch._id }),
          Product.aggregate([
            { $match: { branch: branch._id } },
            {
              $group: {
                _id: null,
                totalStock: { $sum: "$stock" },
                inventoryValue: { $sum: { $multiply: ["$stock", "$price"] } },
                lowStockCount: {
                  $sum: {
                    $cond: [{ $lte: ["$stock", "$minStock"] }, 1, 0],
                  },
                },
              },
            },
          ]),
        ]);

        const inventory = inventoryAgg[0] || {
          totalStock: 0,
          inventoryValue: 0,
          lowStockCount: 0,
        };

        return {
          _id: branch._id,
          name: branch.name,
          city: branch.city,
          status: branch.status,
          latitude: branch.latitude,
          longitude: branch.longitude,
          orders: orderCount,
          totalStock: inventory.totalStock,
          inventoryValue: inventory.inventoryValue,
          lowStockCount: inventory.lowStockCount,
        };
      })
    );

    res.status(200).json({ success: true, branches: results });
  } catch (error) {
    console.error("BRANCH ANALYTICS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
