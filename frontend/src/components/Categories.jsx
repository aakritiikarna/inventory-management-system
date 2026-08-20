import { useState } from "react";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
  FaTags,
} from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Electronics",
      description: "Electronic devices and products",
      products: 24,
    },
    {
      id: 2,
      name: "Accessories",
      description: "Computer and mobile accessories",
      products: 36,
    },
    {
      id: 3,
      name: "Office Supplies",
      description: "Office and stationery products",
      products: 18,
    },
    {
      id: 4,
      name: "Furniture",
      description: "Office and home furniture",
      products: 12,
    },
    {
      id: 5,
      name: "Networking",
      description: "Networking devices and equipment",
      products: 9,
    },
  ]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");

  // =========================
  // FILTER CATEGORIES
  // =========================

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // OPEN ADD MODAL
  // =========================

  const handleAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setShowModal(true);
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description);
    setShowModal(true);
  };

  // =========================
  // CLOSE MODAL
  // =========================

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setName("");
    setDescription("");
  };

  // =========================
  // SAVE CATEGORY
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a category name.");
      return;
    }

    if (editingId) {
      // UPDATE
      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingId
            ? {
                ...category,
                name: name.trim(),
                description:
                  description.trim() ||
                  "No description available",
              }
            : category
        )
      );
    } else {
      // ADD
      const newCategory = {
        id: Date.now(),
        name: name.trim(),
        description:
          description.trim() ||
          "No description available",
        products: 0,
      };

      setCategories((previous) => [
        ...previous,
        newCategory,
      ]);
    }

    handleClose();
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {
    const category = categories.find(
      (item) => item.id === id
    );

    if (!category) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    setCategories((previous) =>
      previous.filter(
        (category) => category.id !== id
      )
    );
  };

  return (
    <div className="space-y-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Categories
          </h1>

          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Manage your product categories
          </p>
        </div>

        {/* ADD BUTTON */}

        <button
          type="button"
          onClick={handleAdd}
          className="
            flex
            items-center
            justify-center
            gap-2
            px-5
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            shadow-lg
            hover:shadow-xl
            active:scale-95
            transition-all
            duration-200
            cursor-pointer
          "
        >
          <FaPlus />

          Add Category
        </button>

      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-2xl
          p-5
          shadow-sm
        "
      >

        <div className="relative w-full md:w-96">

          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search categories..."
            className="
              w-full
              pl-11
              pr-4
              py-3
              rounded-xl
              border
              border-gray-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-gray-800
              dark:text-white
              placeholder-gray-400
              outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>

      </div>

      {/* =====================================
          TABLE
      ===================================== */}

      <div
        className="
          bg-white
          dark:bg-slate-900
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-gray-50
                dark:bg-slate-800
              "
            >

              <tr>

                <th
                  className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-700
                    dark:text-gray-200
                  "
                >
                  Category
                </th>

                <th
                  className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-700
                    dark:text-gray-200
                  "
                >
                  Description
                </th>

                <th
                  className="
                    text-left
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-700
                    dark:text-gray-200
                  "
                >
                  Products
                </th>

                <th
                  className="
                    text-center
                    px-6
                    py-4
                    text-sm
                    font-semibold
                    text-gray-700
                    dark:text-gray-200
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
                      text-center
                      py-12
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    No categories found.
                  </td>

                </tr>

              ) : (

                filteredCategories.map((category) => (

                  <tr
                    key={category.id}
                    className="
                      border-t
                      border-gray-200
                      dark:border-slate-700
                      hover:bg-gray-50
                      dark:hover:bg-slate-800
                      transition-colors
                    "
                  >

                    {/* CATEGORY */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            w-11
                            h-11
                            rounded-xl
                            bg-blue-100
                            dark:bg-blue-900/40
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                          "
                        >
                          <FaTags className="text-blue-600 dark:text-blue-400" />
                        </div>

                        <span
                          className="
                            font-semibold
                            text-gray-800
                            dark:text-white
                          "
                        >
                          {category.name}
                        </span>

                      </div>

                    </td>

                    {/* DESCRIPTION */}

                    <td
                      className="
                        px-6
                        py-5
                        text-gray-600
                        dark:text-gray-300
                      "
                    >
                      {category.description}
                    </td>

                    {/* PRODUCTS */}

                    <td className="px-6 py-5">

                      <span
                        className="
                          inline-flex
                          items-center
                          px-3
                          py-1
                          rounded-full
                          bg-green-100
                          dark:bg-green-900/30
                          text-green-700
                          dark:text-green-400
                          font-semibold
                          text-sm
                        "
                      >
                        {category.products}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-5">

                      <div className="flex justify-center gap-3">

                        {/* EDIT */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(category)
                          }
                          className="
                            w-10
                            h-10
                            rounded-lg
                            bg-blue-100
                            dark:bg-blue-900/40
                            text-blue-600
                            dark:text-blue-400
                            flex
                            items-center
                            justify-center
                            hover:bg-blue-200
                            dark:hover:bg-blue-800
                            active:scale-90
                            transition
                            cursor-pointer
                          "
                          title="Edit"
                        >
                          <FaEdit />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(category.id)
                          }
                          className="
                            w-10
                            h-10
                            rounded-lg
                            bg-red-100
                            dark:bg-red-900/40
                            text-red-600
                            dark:text-red-400
                            flex
                            items-center
                            justify-center
                            hover:bg-red-200
                            dark:hover:bg-red-800
                            active:scale-90
                            transition
                            cursor-pointer
                          "
                          title="Delete"
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/60
            flex
            items-center
            justify-center
            p-4
          "
          onClick={handleClose}
        >

          <div
            className="
              w-full
              max-w-lg
              bg-white
              dark:bg-slate-900
              rounded-2xl
              shadow-2xl
              p-6
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between mb-6">

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                    text-gray-800
                    dark:text-white
                  "
                >
                  {editingId
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    mt-1
                  "
                >
                  {editingId
                    ? "Update category details"
                    : "Create a new category"}
                </p>

              </div>

              <button
                type="button"
                onClick={handleClose}
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  dark:text-gray-300
                  hover:bg-gray-100
                  dark:hover:bg-slate-800
                  transition
                  cursor-pointer
                "
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="mb-5">

                <label
                  className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-700
                    dark:text-gray-200
                  "
                >
                  Category Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter category name"
                  autoFocus
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                    dark:border-slate-700
                    bg-white
                    dark:bg-slate-800
                    text-gray-800
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

              {/* DESCRIPTION */}

              <div className="mb-6">

                <label
                  className="
                    block
                    mb-2
                    text-sm
                    font-semibold
                    text-gray-700
                    dark:text-gray-200
                  "
                >
                  Description
                </label>

                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Enter category description"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                    dark:border-slate-700
                    bg-white
                    dark:bg-slate-800
                    text-gray-800
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                    resize-none
                  "
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={handleClose}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    border
                    border-gray-300
                    dark:border-slate-700
                    text-gray-700
                    dark:text-gray-200
                    hover:bg-gray-100
                    dark:hover:bg-slate-800
                    transition
                    cursor-pointer
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    font-semibold
                    shadow-lg
                    active:scale-95
                    transition
                    cursor-pointer
                  "
                >
                  {editingId
                    ? "Update Category"
                    : "Add Category"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Categories;