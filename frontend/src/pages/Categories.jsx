import { useEffect, useMemo, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/common/ConfirmModal";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaTag,
} from "react-icons/fa";

const API_URL = "/categories";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);

  // =========================================================
  // GET CATEGORIES
  // =========================================================

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("pos-token");

      const response = await API.get(API_URL, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      /*
        Backend may return:

        [
          {...}
        ]

        OR

        {
          categories: [...]
        }

        OR

        {
          data: [...]
        }
      */

      let data = response.data;

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      } else if (Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        console.warn("Unexpected category response:", data);
        setCategories([]);
      }
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load categories."
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD ON PAGE OPEN
  // =========================================================

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  // =========================================================
  // OPEN ADD MODAL
  // =========================================================

  const openAddModal = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      status: "active",
    });

    setShowModal(true);
  };

  // =========================================================
  // OPEN EDIT MODAL
  // =========================================================

  const openEditModal = (category) => {
    setEditingCategory(category);

    setFormData({
      name:
        category.name ||
        category.categoryName ||
        category.title ||
        "",
      description:
        category.description ||
        "",
      status:
        category.status ||
        "active",
    });

    setShowModal(true);
  };

  // =========================================================
  // CLOSE MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      description: "",
      status: "active",
    });
  };

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a category name.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("pos-token");

      const config = {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      };

      if (editingCategory) {
        // UPDATE

        const id =
          editingCategory._id ||
          editingCategory.id;

        await API.put(
          `${API_URL}/${id}`,
          formData,
          config
        );

        toast.success("Category updated successfully.");
      } else {
        // CREATE

        await API.post(
          API_URL,
          formData,
          config
        );

        toast.success("Category added successfully.");
      }

      closeModal();

      await fetchCategories();
    } catch (err) {
      console.error("SAVE CATEGORY ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE
  // =========================================================

  const handleDelete = async () => {
    if (!confirmDelete) return;

    const id = confirmDelete._id || confirmDelete.id;

    try {
      const token = localStorage.getItem("pos-token");

      await API.delete(
        `${API_URL}/${id}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      toast.success("Category deleted successfully.");
      setConfirmDelete(null);

      await fetchCategories();
    } catch (err) {
      console.error("DELETE CATEGORY ERROR:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to delete category."
      );
    }
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredCategories = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return categories;
    }

    return categories.filter((category) => {
      const name =
        category.name ||
        category.categoryName ||
        category.title ||
        "";

      const description =
        category.description ||
        "";

      const status =
        category.status ||
        "";

      return (
        name.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query) ||
        status.toLowerCase().includes(query)
      );
    });
  }, [categories, search]);

  // =========================================================
  // GET CATEGORY NAME
  // =========================================================

  const getCategoryName = (category) => {
    return (
      category.name ||
      category.categoryName ||
      category.title ||
      "Unnamed Category"
    );
  };

  // =========================================================
  // GET DESCRIPTION
  // =========================================================

  const getDescription = (category) => {
    return (
      category.description ||
      "No description"
    );
  };

  // =========================================================
  // GET STATUS
  // =========================================================

  const getStatus = (category) => {
    return (
      category.status ||
      "active"
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Categories
          </h1>

          <p className="text-slate-400 mt-1">
            Manage your product categories
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="
            flex items-center justify-center gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            shadow-lg
            hover:shadow-blue-500/20
            transition-all
            duration-300
            hover:-translate-y-0.5
          "
        >
          <FaPlus />

          Add Category
        </button>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          shadow-lg
        "
      >

        <div className="relative max-w-xl">

          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              bg-slate-800
              border
              border-slate-700
              text-white
              placeholder-slate-400
              rounded-xl
              py-3
              pl-11
              pr-4
              outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              transition
            "
          />

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            bg-red-500/10
            border
            border-red-500/30
            text-red-400
            rounded-xl
            p-4
          "
        >
          {error}
        </div>
      )}

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          overflow-hidden
          shadow-xl
        "
      >

        {loading ? (
          <div className="p-12 text-center">

            <div
              className="
                w-10
                h-10
                border-4
                border-slate-700
                border-t-blue-500
                rounded-full
                animate-spin
                mx-auto
              "
            />

            <p className="text-slate-400 mt-4">
              Loading categories...
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="bg-slate-800">

                  <th
                    className="
                      text-left
                      px-6
                      py-5
                      text-white
                      font-semibold
                    "
                  >
                    Category
                  </th>

                  <th
                    className="
                      text-left
                      px-6
                      py-5
                      text-white
                      font-semibold
                    "
                  >
                    Description
                  </th>

                  <th
                    className="
                      text-left
                      px-6
                      py-5
                      text-white
                      font-semibold
                    "
                  >
                    Status
                  </th>

                  <th
                    className="
                      text-right
                      px-6
                      py-5
                      text-white
                      font-semibold
                    "
                  >
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredCategories.length === 0 ? (
                  <tr>

                    <td
                      colSpan="4"
                      className="
                        px-6
                        py-16
                        text-center
                        text-slate-400
                      "
                    >

                      <FaTag
                        className="
                          mx-auto
                          text-4xl
                          text-slate-600
                          mb-4
                        "
                      />

                      <p className="text-lg">
                        No categories found
                      </p>

                      <button
                        type="button"
                        onClick={openAddModal}
                        className="
                          mt-4
                          text-blue-400
                          hover:text-blue-300
                          font-medium
                        "
                      >
                        + Add your first category
                      </button>

                    </td>

                  </tr>
                ) : (
                  filteredCategories.map(
                    (category) => (
                      <tr
                        key={
                          category._id ||
                          category.id
                        }
                        className="
                          border-t
                          border-slate-800
                          hover:bg-slate-800/60
                          transition-colors
                        "
                      >

                        {/* CATEGORY NAME */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div
                              className="
                                w-10
                                h-10
                                rounded-xl
                                bg-blue-500/10
                                text-blue-400
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <FaTag />
                            </div>

                            <span
                              className="
                                text-white
                                font-semibold
                              "
                            >
                              {getCategoryName(
                                category
                              )}
                            </span>

                          </div>

                        </td>

                        {/* DESCRIPTION */}

                        <td
                          className="
                            px-6
                            py-5
                            text-slate-400
                          "
                        >
                          {getDescription(
                            category
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-5">

                          <span
                            className={`
                              inline-flex
                              px-4
                              py-2
                              rounded-full
                              text-sm
                              font-semibold
                              ${
                                getStatus(
                                  category
                                ).toLowerCase() ===
                                "active"
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-red-500/10 text-red-400"
                              }
                            `}
                          >
                            {getStatus(category)}
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-6 py-5">

                          <div className="flex justify-end gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  category
                                )
                              }
                              className="
                                w-11
                                h-11
                                rounded-xl
                                bg-blue-500/10
                                text-blue-400
                                hover:bg-blue-500
                                hover:text-white
                                flex
                                items-center
                                justify-center
                                transition-all
                                duration-200
                                hover:scale-105
                              "
                              title="Edit category"
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setConfirmDelete(category)
                              }
                              className="
                                w-11
                                h-11
                                rounded-xl
                                bg-red-500/10
                                text-red-400
                                hover:bg-red-500
                                hover:text-white
                                flex
                                items-center
                                justify-center
                                transition-all
                                duration-200
                                hover:scale-105
                              "
                              title="Delete category"
                            >
                              <FaTrash />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/70
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
            z-[100]
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >

          <div
            className="
              w-full
              max-w-lg
              bg-slate-900
              border
              border-slate-700
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-5
                border-b
                border-slate-800
              "
            >

              <div>

                <h2 className="text-xl font-bold text-white">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  {editingCategory
                    ? "Update category information"
                    : "Create a new product category"}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-slate-800
                  text-slate-400
                  hover:text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Category Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    text-white
                    placeholder-slate-500
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

                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this category..."
                  rows="4"
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    text-white
                    placeholder-slate-500
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    resize-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

              {/* STATUS */}

              <div>

                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="
                    w-full
                    bg-slate-800
                    border
                    border-slate-700
                    text-white
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-slate-800
                    hover:bg-slate-700
                    text-white
                    font-semibold
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    transition
                    disabled:opacity-50
                  "
                >
                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Add Category"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${confirmDelete?.name || confirmDelete?.categoryName || "this category"}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

    </div>
  );
};

export default Categories;