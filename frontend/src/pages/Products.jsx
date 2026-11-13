import { useEffect, useState } from "react";
import API from "../api/api";
import ProductImage from "../components/common/ProductImage";
import { getProductImage, buildPlaceholder } from "../utils/productImages";
import { getBranches } from "../services/branchService";
import ConfirmModal from "../components/common/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCurrency } from "../context/CurrencyContext";
import { useAuth } from "../context/AuthContext";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

const API_URL = "/products";

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
  sku: "",
  minStock: "",
  costPrice: "",
  branch: "",
};

const Products = () => {
  const { formatMoney } = useCurrency();
  const { user } = useAuth();
  // Admins manage inventory. Everyone else gets a read-only catalog: the
  // API itself strips stock/branch/cost for them (see server/utils/sanitize.js),
  // this just stops the UI from offering controls that would 403 anyway.
  const isAdmin = user?.role === "admin";
  const colCount = isAdmin ? 6 : 4;
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // LOAD PRODUCTS FROM MONGODB
  // =====================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await API.get(API_URL);

      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load products from server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    if (isAdmin) {
      getBranches()
        .then(({ data }) => setBranches(data.branches || []))
        .catch((err) => console.error("FETCH BRANCHES ERROR:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =====================================================
  // OPEN ADD PRODUCT
  // =====================================================

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
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
      sku: product.sku || "",
      minStock: product.minStock ?? "",
      costPrice: product.costPrice ?? "",
      branch: product.branch?._id || product.branch || "",
    });

    setImageFile(null);
    setImagePreview(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
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
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      const productData = new FormData();
      productData.append("productName", formData.productName.trim());
      productData.append("description", formData.description.trim());
      productData.append("category", formData.category);
      productData.append("supplier", formData.supplier.trim());
      productData.append("price", Number(formData.price));
      productData.append("stock", Number(formData.stock));
      if (formData.sku) productData.append("sku", formData.sku.trim());
      if (formData.minStock !== "") productData.append("minStock", Number(formData.minStock));
      productData.append("costPrice", formData.costPrice === "" ? "" : Number(formData.costPrice));
      productData.append("branch", formData.branch || "");
      if (imageFile) productData.append("image", imageFile);

      // =================================================
      // UPDATE
      // =================================================

      if (editingProduct) {
        const response = await API.put(
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

          toast.success("Product updated successfully!");

          closeModal();
        }

        return;
      }

      // =================================================
      // ADD
      // =================================================

      const response = await API.post(
        API_URL,
        productData
      );

      if (response.data.success) {
        setProducts((currentProducts) => [
          response.data.product,
          ...currentProducts,
        ]);

        toast.success("Product added successfully!");

        closeModal();
      }
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);

      toast.error(
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

  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      const response = await API.delete(
        `${API_URL}/${confirmDelete._id}`
      );

      if (response.data.success) {
        setProducts((currentProducts) =>
          currentProducts.filter(
            (product) => product._id !== confirmDelete._id
          )
        );

        toast.success("Product deleted successfully!");
        setConfirmDelete(null);
      }
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(
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
    setImageFile(null);
    setImagePreview(null);
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
            {isAdmin ? "Manage all your inventory products" : "Browse the product catalog"}
          </p>
        </div>

        {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-md transition"
        >
          <FaPlus />

          Add Product
        </motion.button>
        )}

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
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Product</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Category</th>
                {isAdmin && <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Branch</th>}
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Price</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{isAdmin ? "Stock" : "Availability"}</th>
                {isAdmin && <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>}
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan={colCount} className="p-12 text-center">
                    <div className="flex justify-center items-center gap-3 text-blue-600">
                      <FaSpinner className="animate-spin" />
                      Loading products...
                    </div>
                  </td>
                </tr>

              ) : filteredProducts.length > 0 ? (

                filteredProducts.map((product) => {
                  const minStock = product.minStock ?? 5;
                  const stockOk = product.stock > minStock;
                  const stockZero = product.stock <= 0;

                  return (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {/* PRODUCT */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
<ProductImage product={product} size={44} />
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 dark:text-white truncate">{product.productName}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {product.sku ? `${product.sku} · ` : ""}{product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{product.category}</td>

                    {/* BRANCH (admin only) */}
                    {isAdmin && (
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {product.branch?.name || <span className="text-slate-300 dark:text-slate-600">Unassigned</span>}
                    </td>
                    )}

                    {/* PRICE */}
                    <td className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {formatMoney(Number(product.price))}
                    </td>

                    {/* STOCK (admin: exact count / others: availability only) */}
                    <td className="px-6 py-4">
                      {!isAdmin ? (
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            product.inStock
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {product.inStock ? "In stock" : "Out of stock"}
                        </span>
                      ) : (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          stockZero
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : stockOk
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }`}
                      >
                        {product.stock}
                      </span>
                      )}
                    </td>

                    {/* ACTIONS (admin only) */}
                    {isAdmin && (
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition cursor-pointer flex items-center justify-center"
                          title="Edit Product"
                        >
                          <FaEdit size={13} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(product)}
                          className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white transition cursor-pointer flex items-center justify-center"
                          title="Delete Product"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                    )}
                  </motion.tr>
                  );
                })

              ) : (

                <tr>
                  <td colSpan={colCount} className="text-center p-10 text-slate-500 dark:text-slate-400">
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

                {/* PRODUCT IMAGE */}

                <div className="flex items-center gap-4">
                  <img
                    src={
                      imagePreview ||
                      getProductImage(editingProduct) ||
                      buildPlaceholder(formData.productName, 72)
                    }
                    onError={(e) => { e.target.src = buildPlaceholder(formData.productName, 72); }}
                    alt="Product preview"
                    className="w-18 h-18 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    style={{ width: 72, height: 72 }}
                  />

                  <label className="flex-1">
                    <span className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                      Product Image
                    </span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-600 dark:file:text-blue-400 file:font-medium hover:file:bg-blue-100 cursor-pointer"
                    />
                    <span className="text-xs text-slate-400">JPG, PNG or WEBP. Max 5MB.</span>
                  </label>
                </div>

                {/* SKU */}

                <div>
                  <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="Example: LAP-001"
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* BRANCH */}

                <div>
                  <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                    Branch
                  </label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>{b.name} — {b.city}</option>
                    ))}
                  </select>
                </div>

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

                {/* PRICE + COST PRICE */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>

                    <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                      Price (USD) *
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
                      Cost Price (USD)
                    </label>

                    <input
                      type="number"
                      name="costPrice"
                      min="0"
                      value={formData.costPrice}
                      onChange={handleChange}
                      placeholder="Optional — enables real profit reporting"
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

                {/* STOCK + MIN STOCK */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

                  <div>

                    <label className="block mb-2 font-medium text-slate-700 dark:text-slate-200">
                      Min Stock
                    </label>

                    <input
                      type="number"
                      name="minStock"
                      min="0"
                      value={formData.minStock}
                      onChange={handleChange}
                      placeholder="5"
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

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDelete?.productName}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

    </div>
  );
};

export default Products;