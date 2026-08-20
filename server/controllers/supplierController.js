import Supplier from "../models/Supplier.js";

// ======================================
// ADD SUPPLIER
// ======================================
export const addSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json({
      success: true,
      message: "Supplier Added Successfully",
      supplier,
    });
  } catch (error) {
    console.error("ADD SUPPLIER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL SUPPLIERS
// ======================================
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      suppliers,
    });
  } catch (error) {
    console.error("GET SUPPLIERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// UPDATE SUPPLIER
// ======================================
export const updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier Updated Successfully",
      supplier,
    });
  } catch (error) {
    console.error("UPDATE SUPPLIER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE SUPPLIER
// ======================================
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(
      req.params.id
    );

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier Deleted Successfully",
    });
  } catch (error) {
    console.error("DELETE SUPPLIER ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};