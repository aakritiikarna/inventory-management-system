import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import ConfirmModal from "../components/common/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaTimes,
} from "react-icons/fa";

const API_URL = "/suppliers";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [editingSupplier, setEditingSupplier] = useState(null);

  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);

  const [formData, setFormData] = useState({
    supplierName: "",
    contactPerson: "",
    phone: "",
    email: "",
    category: "Electronics",
    status: "active",
  });

  // ==========================================
  // GET SUPPLIERS
  // ==========================================
  const fetchSuppliers = async () => {
    try {
      setLoading(true);

      const response = await API.get(API_URL);

      setSuppliers(response.data.suppliers || []);
    } catch (error) {
      console.error("GET SUPPLIERS ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load suppliers"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD SUPPLIERS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSuppliers();
  }, []);

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================
  const handleAddSupplier = () => {
    setEditingSupplier(null);

    setFormData({
      supplierName: "",
      contactPerson: "",
      phone: "",
      email: "",
      category: "Electronics",
      status: "active",
    });

    setShowModal(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);

    setFormData({
      supplierName: supplier.supplierName || "",
      contactPerson: supplier.contactPerson || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      category: supplier.category || "Electronics",
      status: supplier.status || "active",
    });

    setShowModal(true);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // ADD / UPDATE SUPPLIER
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.supplierName.trim() ||
      !formData.contactPerson.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.category.trim()
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);

      // ======================================
      // UPDATE
      // ======================================
      if (editingSupplier) {
        const response = await API.put(
          `${API_URL}/${editingSupplier._id}`,
          formData
        );

        toast.success(
          response.data.message ||
            "Supplier updated successfully"
        );
      }

      // ======================================
      // ADD
      // ======================================
      else {
        const response = await API.post(
          API_URL,
          formData
        );

        toast.success(
          response.data.message ||
            "Supplier added successfully"
        );
      }

      // Refresh from MongoDB
      await fetchSuppliers();

      // Close modal
      setShowModal(false);

      setEditingSupplier(null);

      setFormData({
        supplierName: "",
        contactPerson: "",
        phone: "",
        email: "",
        category: "Electronics",
        status: "active",
      });
    } catch (error) {
      console.error(
        "SAVE SUPPLIER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to save supplier"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // DELETE SUPPLIER
  // ==========================================
  const handleDelete = async () => {
    if (!confirmDelete) return;

    try {
      await API.delete(`${API_URL}/${confirmDelete._id}`);

      toast.success("Supplier deleted successfully");
      setConfirmDelete(null);

      // Refresh MongoDB data
      await fetchSuppliers();
    } catch (error) {
      console.error(
        "DELETE SUPPLIER ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to delete supplier"
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================
  const filteredSuppliers = suppliers.filter(
    (supplier) => {
      const searchText =
        search.toLowerCase();

      return (
        supplier.supplierName
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.contactPerson
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.phone
          ?.toLowerCase()
          .includes(searchText) ||
        supplier.category
          ?.toLowerCase()
          .includes(searchText)
      );
    }
  );

  return (
    <div className="space-y-6">

      {/* ======================================
          HEADER
      ======================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Suppliers
          </h1>

          <p className="text-slate-400 mt-1">
            Manage your inventory suppliers
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleAddSupplier}
          className="
            flex
            items-center
            justify-center
            gap-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-xl
            shadow-md
            transition
          "
        >
          <FaPlus />

          Add Supplier
        </motion.button>

      </div>

      {/* ======================================
          SEARCH
      ======================================= */}
      <div
        className="
          bg-slate-900
          rounded-2xl
          shadow-sm
          p-5
        "
      >
        <div className="relative w-full md:w-96">

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
            placeholder="Search supplier..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              border
              border-slate-700
              bg-slate-800
              text-white
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
      </div>

      {/* ======================================
          TABLE
      ======================================= */}
      <div
        className="
          bg-slate-900
          rounded-2xl
          shadow-sm
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
                bg-slate-800
              "
            >

              <tr>

                <th className="text-left p-5 text-white">
                  Supplier
                </th>

                <th className="text-left p-5 text-white">
                  Contact
                </th>

                <th className="text-left p-5 text-white">
                  Phone
                </th>

                <th className="text-left p-5 text-white">
                  Category
                </th>

                <th className="text-left p-5 text-white">
                  Status
                </th>

                <th className="text-center p-5 text-white">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {/* =================================
                  LOADING
              ================================== */}
              {loading ? (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      text-center
                      p-10
                      text-blue-400
                    "
                  >
                    Loading suppliers...
                  </td>

                </tr>

              ) : filteredSuppliers.length > 0 ? (

                filteredSuppliers.map(
                  (supplier) => (

                    <motion.tr
                      key={supplier._id}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      className="
                        border-t
                        border-slate-700
                        hover:bg-slate-800
                        transition
                      "
                    >

                      {/* SUPPLIER */}

                      <td
                        className="
                          p-5
                          font-semibold
                          text-white
                        "
                      >
                        {supplier.supplierName}
                      </td>

                      {/* CONTACT */}

                      <td
                        className="
                          p-5
                          text-slate-300
                        "
                      >
                        {supplier.contactPerson ||
                          "—"}
                      </td>

                      {/* PHONE */}

                      <td
                        className="
                          p-5
                          text-slate-300
                        "
                      >
                        {supplier.phone ||
                          "—"}
                      </td>

                      {/* CATEGORY */}

                      <td
                        className="
                          p-5
                          text-slate-300
                        "
                      >
                        {supplier.category ||
                          "—"}
                      </td>

                      {/* STATUS */}

                      <td className="p-5">

                        <span
                          className={`
                            inline-flex
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                            ${
                              supplier.status ===
                              "active"
                                ? "bg-green-900/40 text-green-400"
                                : "bg-red-900/40 text-red-400"
                            }
                          `}
                        >
                          {supplier.status ||
                            "active"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="p-5">

                        <div
                          className="
                            flex
                            justify-center
                            gap-3
                          "
                        >

                          {/* EDIT */}

                          <motion.button
                            whileHover={{
                              scale: 1.08,
                            }}
                            whileTap={{
                              scale: 0.92,
                            }}
                            onClick={() =>
                              handleEdit(
                                supplier
                              )
                            }
                            className="
                              bg-blue-900/30
                              hover:bg-blue-900/50
                              text-blue-400
                              p-3
                              rounded-lg
                              transition
                            "
                            title="Edit Supplier"
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
                              setConfirmDelete(supplier)
                            }
                            className="
                              bg-red-900/30
                              hover:bg-red-900/50
                              text-red-400
                              p-3
                              rounded-lg
                              transition
                            "
                            title="Delete Supplier"
                          >
                            <FaTrash />
                          </motion.button>

                        </div>

                      </td>

                    </motion.tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="
                      text-center
                      p-10
                      text-slate-400
                    "
                  >
                    No suppliers found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ======================================
          ADD / EDIT MODAL
      ======================================= */}

      <AnimatePresence>

        {showModal && (

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[100]
              bg-black/60
              flex
              items-center
              justify-center
              p-4
            "
            onClick={() =>
              !saving &&
              setShowModal(false)
            }
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
                bg-slate-900
                rounded-2xl
                shadow-2xl
                p-6
              "
            >

              {/* MODAL HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-6
                "
              >

                <div>

                  <h2
                    className="
                      text-2xl
                      font-bold
                      text-white
                    "
                  >
                    {editingSupplier
                      ? "Edit Supplier"
                      : "Add Supplier"}
                  </h2>

                  <p
                    className="
                      text-sm
                      text-slate-400
                      mt-1
                    "
                  >
                    {editingSupplier
                      ? "Update supplier information"
                      : "Add a new supplier"}
                  </p>

                </div>

                <button
                  disabled={saving}
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    text-slate-400
                    hover:text-red-400
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

                {/* SUPPLIER NAME */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      font-medium
                      text-slate-200
                    "
                  >
                    Supplier Name *
                  </label>

                  <input
                    type="text"
                    name="supplierName"
                    value={
                      formData.supplierName
                    }
                    onChange={handleChange}
                    placeholder="Dell"
                    className="
                      w-full
                      border
                      border-slate-700
                      bg-slate-800
                      text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                {/* CONTACT PERSON */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      font-medium
                      text-slate-200
                    "
                  >
                    Contact Person *
                  </label>

                  <input
                    type="text"
                    name="contactPerson"
                    value={
                      formData.contactPerson
                    }
                    onChange={handleChange}
                    placeholder="John Smith"
                    className="
                      w-full
                      border
                      border-slate-700
                      bg-slate-800
                      text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                {/* PHONE */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      font-medium
                      text-slate-200
                    "
                  >
                    Phone *
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9800000000"
                    className="
                      w-full
                      border
                      border-slate-700
                      bg-slate-800
                      text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      font-medium
                      text-slate-200
                    "
                  >
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                    className="
                      w-full
                      border
                      border-slate-700
                      bg-slate-800
                      text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  />

                </div>

                {/* CATEGORY */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      font-medium
                      text-slate-200
                    "
                  >
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-slate-700
                      bg-slate-800
                      text-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                    "
                  >

                    <option value="Electronics">
                      Electronics
                    </option>

                    <option value="Accessories">
                      Accessories
                    </option>

                    <option value="Furniture">
                      Furniture
                    </option>

                    <option value="Office Supplies">
                      Office Supplies
                    </option>

                  </select>

                </div>

                {/* STATUS */}

                <div>

                  <label
                    className="
                      block
                      mb-2
                      font-medium
                      text-slate-200
                    "
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="
                      w-full
                      border
                      border-slate-700
                      bg-slate-800
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

                <div
                  className="
                    flex
                    gap-3
                    pt-3
                  "
                >

                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="
                      flex-1
                      py-3
                      rounded-xl
                      border
                      border-slate-700
                      text-slate-300
                      hover:bg-slate-800
                      transition
                    "
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{
                      scale: saving
                        ? 1
                        : 1.02,
                    }}
                    whileTap={{
                      scale: saving
                        ? 1
                        : 0.97,
                    }}
                    disabled={saving}
                    type="submit"
                    className="
                      flex-1
                      py-3
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      disabled:opacity-60
                      text-white
                      font-semibold
                      shadow-lg
                      transition
                    "
                  >
                    {saving
                      ? "Saving..."
                      : editingSupplier
                      ? "Update Supplier"
                      : "Add Supplier"}
                  </motion.button>

                </div>

              </form>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${confirmDelete?.supplierName || "this supplier"}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

    </div>
  );
};

export default Suppliers;