import Category from "../models/Category.js";

// ==========================================
// CREATE CATEGORY
// ==========================================

export const createCategory = async (req, res) => {
  try {
    console.log(
      "CATEGORY REQUEST RECEIVED:",
      req.body
    );

    const {
      name,
      description,
      status,
    } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Check duplicate
    const existingCategory =
      await Category.findOne({
        name: name.trim(),
      });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Create category
    const category = await Category.create({
      name: name.trim(),
      description: description?.trim() || "",
      status: status || "active",
    });

    console.log(
      "CATEGORY SAVED TO MONGODB:",
      category
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });

  } catch (error) {
    console.error(
      "CREATE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL CATEGORIES
// ==========================================

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      categories,
    });

  } catch (error) {
    console.error(
      "GET CATEGORIES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET SINGLE CATEGORY
// ==========================================

export const getCategoryById = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });

  } catch (error) {
    console.error(
      "GET CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE CATEGORY
// ==========================================

export const updateCategory = async (
  req,
  res
) => {
  try {
    const {
      name,
      description,
      status,
    } = req.body;

    const category =
      await Category.findByIdAndUpdate(
        req.params.id,
        {
          name: name?.trim(),
          description: description?.trim() || "",
          status: status || "active",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });

  } catch (error) {
    console.error(
      "UPDATE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// DELETE CATEGORY
// ==========================================

export const deleteCategory = async (
  req,
  res
) => {
  try {
    const category =
      await Category.findByIdAndDelete(
        req.params.id
      );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE CATEGORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};