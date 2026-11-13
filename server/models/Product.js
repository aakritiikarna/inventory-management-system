import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    // Optional — when set, lets the dashboard compute real profit
    // (price - costPrice) instead of guessing. Left null means "unknown
    // cost", and the profit calculation treats those products as
    // contributing zero profit rather than fabricating a margin.
    costPrice: {
      type: Number,
      default: null,
    },

    stock: {
      type: Number,
      required: true,
    },

    minStock: {
      type: Number,
      default: 5,
    },

    sku: {
      type: String,
      trim: true,
      uppercase: true,
      unique: true,
      sparse: true,
    },

    image: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true,
    },

    supplier: {
      type: String,
      required: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;