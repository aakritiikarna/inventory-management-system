import Product from "../models/Product.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { toPublicPath } from "../middleware/uploadMiddleware.js";
import { publicProduct, isAdmin } from "../utils/sanitize.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, "..", "uploads");

// Removes an old product image file from disk when it's replaced/deleted.
// Never throws — a missing file should never fail the request.
const removeImageFile = (imagePath) => {
  if (!imagePath) return;
  try {
    const relative = imagePath.replace(/^\/uploads\//, "");
    const fullPath = path.join(uploadsRoot, relative);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err) {
    console.error("Failed to remove old product image:", err.message);
  }
};

// ===============================
// ADD PRODUCT
// POST /api/products
// ===============================

export const addProduct = async (req, res) => {
  try {
    const image = req.file ? toPublicPath("products", req.file.filename) : "";

    const product = await Product.create({
      productName: req.body.productName,
      description: req.body.description,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      minStock:
        req.body.minStock === undefined || req.body.minStock === ""
          ? undefined
          : Number(req.body.minStock),
      costPrice:
        req.body.costPrice === undefined || req.body.costPrice === ""
          ? undefined
          : Number(req.body.costPrice),
      sku: req.body.sku || undefined,
      category: req.body.category,
      supplier: req.body.supplier,
      branch: req.body.branch || null,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET PRODUCTS
// GET /api/products
// ===============================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("branch", "name city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products: isAdmin(req) ? products : products.map(publicProduct),
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ===============================

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "branch",
      "name city"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: isAdmin(req) ? product : publicProduct(product),
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE PRODUCT
// PUT /api/products/:id
// ===============================

export const updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = {};
    if (req.body.productName !== undefined) updateData.productName = req.body.productName;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.price !== undefined) updateData.price = Number(req.body.price);
    if (req.body.stock !== undefined) updateData.stock = Number(req.body.stock);
    if (req.body.category !== undefined) updateData.category = req.body.category;
    if (req.body.supplier !== undefined) updateData.supplier = req.body.supplier;
    if (req.body.minStock !== undefined) updateData.minStock = Number(req.body.minStock);
    if (req.body.costPrice !== undefined) updateData.costPrice = req.body.costPrice === "" ? null : Number(req.body.costPrice);
    if (req.body.sku !== undefined) updateData.sku = req.body.sku;
    if (req.body.branch !== undefined) updateData.branch = req.body.branch || null;

    if (req.file) {
      updateData.image = toPublicPath("products", req.file.filename);
      removeImageFile(existing.image);
    } else if (req.body.removeImage === "true") {
      removeImageFile(existing.image);
      updateData.image = "";
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE PRODUCT
// DELETE /api/products/:id
// ===============================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    removeImageFile(product.image);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
