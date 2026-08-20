import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const API_URL = "http://localhost:3000/api/products";

const categoryOptions = [
  "Electronics",
  "Accessories",
  "Furniture",
  "Office Supplies",
];

const emptyForm = {
  productName: "",
  description: "",
  category: "Electronics",
  supplier: "",
  price: "",
  stock: "",
};

const Products = () => {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD PRODUCTS FROM MONGODB
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await axios.get(API_URL);

      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load products from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =====================================================
  // OPEN ADD PRODUCT
  // =====================================================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT PRODUCT
  // =====================================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      productName: product.productName || "",
      description: product.description || "",
      category: product.category || "Electronics",
      supplier: product.supplier || "",
      price: product.price || "",
      stock: product.stock || "",
    });

    setShowModal(true);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // ADD / UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.productName.trim() ||
      !formData.description.trim() ||
      !formData.supplier.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const productData = {
        productName: formData.productName.trim(),
        description: formData.description.trim(),
        category: formData.category,
        supplier: formData.supplier.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      // =================================================
      // UPDATE
      // =================================================

      if (editingProduct) {
        const response = await axios.put(
          `${API_URL}/${editingProduct._id}`,
          productData
        );

        if (response.data.success) {
          setProducts((currentProducts) =>
            currentProducts.map((product) =>
              product._id === editingProduct._id
                ? response.data.product
                : product
            )
          );

          alert("Product updated successfully!");

          closeModal();
        }

        return;
      }

      // =================================================
      // ADD
      // =================================================

      const response = await axios.post(
        API_URL,
        productData
      );

      if (response.data.success) {
        setProducts((currentProducts) => [
          response.data.product,
          ...currentProducts,
        ]);

        alert("Product added successfully!");

        closeModal();
      }
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await axios.delete(
        `${API_URL}/${id}`
      );

      if (response.data.success) {
        setProducts((currentProducts) =>
          currentProducts.filter(
            (product) => product._id !== id
          )
        );

        alert("Product deleted successfully!");
      }
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(emptyForm);
  };

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = products.filter((product) => {
    const productName =
      product.productName?.toLowerCase() || "";

    const matchesSearch = productName.includes(
      search.toLowerCase()
    );

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Products
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage all your inventory products
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition"
        >
          <FaPlus />

          Add Product
        </motion.button>

      </div>

      {/* =================================================
          SEARCH + CATEGORY
      ================================================= */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-5">

        <div className="flex flex-col md:flex-row gap-4">

          {/* SEARCH */}

          <div className="relative w-full md:w-96">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                border border-slate-300
                dark:border-slate-700
                bg-white dark:bg-slate-800
                text-slate-800 dark:text-white
                rounded-xl
                py-3
                pl-11
                pr-4
                outline-none
                focus:ring-2
                focus:ring-blue-500
              "
            />

          </div>

          {/* CATEGORY */}

          <div className="w-full md:w-64">

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              className="
                w-full
                border border-slate-300
                dark:border-slate-700
                bg-white dark:bg-slate-800
                text-slate-800 dark:text-white
                rounded-xl
                py-3
                px-4
                outline-none
                focus:ring-2
                focus:ring-blue-500
                cursor-pointer
              "
            >

              <option value="All">
                All Categories
              </option>

              {categoryOptions.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

          </div>

        </div>

      </div>

      {/* =================================================
          PRODUCT TABLE
      ================================================= */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50 dark:bg-slate-800">

              <tr>

                <th className="text-left p-5 text-slate-700 dark:text-slate-200">
                  Product
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-200">
                  Category
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-200">
                  Price
                </th>

                <th className="text-left p-5 text-slate-700 dark:text-slate-200">
                  Stock
                </th>

                <th className="text-center p-5 text-slate-700 dark:text-slate-200">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="5"
                    className="p-12 text-center"
                  >

                    <div className="flex justify-center items-center gap-3 text-blue-600">

                      <FaSpinner className="animate-spin" />

                      Loading products...

                    </div>

                  </td>

                </tr>

              ) : filteredProducts.length > 0 ? (

                filteredProducts.map((product) => (

                  <motion.tr
                    key={product._id}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="
                      border-t
                      border-slate-200
                      dark:border-slate-700
                      hover:bg-slate-50
                      dark:hover:bg-slate-800
                      transition
                    "
                  >

                    {/* PRODUCT */}

                    <td className="p-5">

                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {product.productName}
                        </p>

                        <p className="text-sm text-slate-400 mt-1">
                          {product.description}
                        </p>
                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="p-5 text-slate-600 dark:text-slate-300">
                      {product.category}
                    </td>

                    {/* PRICE */}

                    <td className="p-5 text-blue-600 dark:text-blue-400 font-semibold">
                      ${Number(product.price).toLocaleString()}
                    </td>

                    {/* STOCK */}

                    <td className="p-5">

                      <span
                        className={`
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-semibold
                          ${
                            product.stock <= 10
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }
                        `}
                      >
                        {product.stock}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="p-5">

                      <div className="flex justify-center gap-3">

                        {/* EDIT */}

                        <motion.button
                          whileHover={{
                            scale: 1.08,
                          }}
                          whileTap={{
                            scale: 0.92,
                          }}
                          onClick={() =>
                            handleEdit(product)
                          }
                          className="
                            bg-blue-100
                            dark:bg-blue-900/30
                            hover:bg-blue-200
                            dark:hover:bg-blue-900/50
                            text-blue-600
                            dark:text-blue-400
                            p-3
                            rounded-lg
                            transition
                          "
                          title="Edit Product"
                        >
                          <FaEdit />
                        </motion.button>

                        {/* DELETE */}

                        <motion.button
                          whileHover={{
                            scale: 1.08,
                          }}
                          whileTap={{
                            scale: 0.92,
                          }}
                          onClick={() =>
                            handleDelete(product._id)
                          }
                          className="
                            bg-red-100
                            dark:bg-red-900/30
                            hover:bg-red-200
                            dark:hover:bg-red-900/50
                            text-red-600
                            dark:text-red-400
                            p-3
                            rounded-lg
                            transition
                          "
                          title="Delete Product"
                        >
                          <FaTrash />
                        </motion.button>

                      </div>

                    </td>

                  </motion.tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center p-10 text-slate-500 dark:text-slate-400"
                  >
                    No products found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      <AnimatePresence>

        {showModal && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[100]
              bg-black/50
              flex
              items-center
              justify-center
              p-4
            "
            onClick={closeModal}
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                w-full
                max-w-lg
                max-h-[90vh]
                overflow-y-auto
                bg-white
                dark:bg-slate-900
                rounded-2xl
                shadow-2xl
                p-6
              "
            >

              {/* HEADER */}

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">

                    {editingProduct
                      ? "Edit Product"
                      : "Add Product"}

                  </h2>

                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">

                    {editingProduct
                      ? "Update product information"
                      : "Add a new product to inventory"}

                  </p>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    text-slate-500
                    hover:text-red-500
                    dark:text-slate-400
                    dark:hover:text-red-400
                    text-xl
                  "
                >
                  <FaTimes />
                </button>

              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* PRODUCT NAME */}

                <div>

                  <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                    Product Name *
                  </label>

                  <input
                    type="text"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="Example: Gaming Laptop"
                    className="
                      w-full
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the product..."
                    rows="3"
                    className="
                      w-full
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      resize-none
                    "
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      cursor-pointer
                    "
                  >

                    {categoryOptions.map(
                      (category) => (
                        <option
                          key={category}
                          value={category}
                        >
                          {category}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* SUPPLIER */}

                <div>

                  <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                    Supplier *
                  </label>

                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Example: Tech World Suppliers"
                    className="
                      w-full
                      border
                      border-slate-300
                      dark:border-slate-700
                      bg-white
                      dark:bg-slate-800
                      text-slate-800
                      dark:text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                {/* PRICE + STOCK */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                      Price *
                    </label>

                    <input
                      type="number"
                      name="price"
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="1250"
                      className="
                        w-full
                        border
                        border-slate-300
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-800
                        text-slate-800
                        dark:text-white
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                  </div>

                  <div>

                    <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                      Stock *
                    </label>

                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="20"
                      className="
                        w-full
                        border
                        border-slate-300
                        dark:border-slate-700
                        bg-white
                        dark:bg-slate-800
                        text-slate-800
                        dark:text-white
                        rounded-xl
                        px-4
                        py-3
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                      "
                    />

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="flex gap-3 pt-3">

                  <button
                    type="button"
                    onClick={closeModal}
                    disabled={saving}
                    className="
                      flex-1
                      py-3
                      rounded-xl
                      border
                      border-slate-300
                      dark:border-slate-700
                      text-slate-700
                      dark:text-slate-300
                      hover:bg-slate-100
                      dark:hover:bg-slate-800
                      transition
                    "
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{
                      scale: saving ? 1 : 1.02,
                    }}
                    whileTap={{
                      scale: saving ? 1 : 0.97,
                    }}
                    disabled={saving}
                    type="submit"
                    className="
                      flex-1
                      py-3
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      disabled:bg-blue-400
                      text-white
                      font-semibold
                      shadow-lg
                      transition
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >

                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Saving...
                      </>
                    ) : editingProduct ? (
                      "Update Product"
                    ) : (
                      "Add Product"
                    )}

                  </motion.button>

                </div>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
};

export default Products;