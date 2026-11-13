import { useEffect, useState } from "react";
import API from "../api/api";
import ConfirmModal from "../components/common/ConfirmModal";
import NepalBranchMap from "../components/common/NepalBranchMap";
import LocationPickerMap from "../components/common/LocationPickerMap";
import { NEPAL_CITIES, findCityCoords } from "../data/nepalCities";
import { getBranchAnalytics } from "../services/branchService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSpinner,
  FaMapMarkerAlt,
} from "react-icons/fa";

const API_URL = "/branches";

const emptyForm = {
  name: "",
  city: "",
  address: "",
  phone: "",
  latitude: "",
  longitude: "",
  status: "active",
};

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  // true while the lat/lng in the form were filled from the chosen city
  // (so we can say so, and know a manual edit has since overridden them)
  const [coordsFromCity, setCoordsFromCity] = useState(false);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await API.get(API_URL);
      if (response.data.success) {
        setBranches(response.data.branches || []);
      }
    } catch (error) {
      console.error("FETCH BRANCHES ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMapData = async () => {
    try {
      const { data } = await getBranchAnalytics();
      setMapData(data.branches || []);
    } catch (error) {
      console.error("FETCH BRANCH ANALYTICS ERROR:", error);
    }
  };

  useEffect(() => {
    // The fetch manages loading state while its request is in flight.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBranches();
    fetchMapData();
  }, []);

  const openAddModal = () => {
    setEditingBranch(null);
    setFormData(emptyForm);
    setCoordsFromCity(false);
    setShowModal(true);
  };

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    setCoordsFromCity(false);
    setFormData({
      name: branch.name || "",
      city: branch.city || "",
      address: branch.address || "",
      phone: branch.phone || "",
      latitude: branch.latitude ?? "",
      longitude: branch.longitude ?? "",
      status: branch.status || "active",
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };

    // Picking a known Nepal city pre-fills the map position, but never
    // overwrites coordinates the admin has already set by hand.
    if (name === "city") {
      const coords = findCityCoords(value);
      const latLngEmptyOrAuto = coordsFromCity || (formData.latitude === "" && formData.longitude === "");
      if (coords && latLngEmptyOrAuto) {
        next.latitude = coords.latitude;
        next.longitude = coords.longitude;
        setCoordsFromCity(true);
      }
    } else if (name === "latitude" || name === "longitude") {
      setCoordsFromCity(false);
    }

    setFormData(next);
  };

  const handlePickOnMap = (lat, lng) => {
    setFormData((f) => ({ ...f, latitude: Number(lat.toFixed(5)), longitude: Number(lng.toFixed(5)) }));
    setCoordsFromCity(false);
  };

  const focusBranchOnMap = (branch) => {
    setSelectedBranchId(branch._id);
    document.getElementById("branch-map")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      if (editingBranch) {
        await API.put(`${API_URL}/${editingBranch._id}`, payload);
      } else {
        await API.post(API_URL, payload);
      }

      toast.success(editingBranch ? "Branch updated" : "Branch added");
      setShowModal(false);
      fetchBranches();
      fetchMapData();
    } catch (error) {
      console.error("SAVE BRANCH ERROR:", error);
      toast.error(error.response?.data?.message || "Unable to save branch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await API.delete(`${API_URL}/${confirmDelete._id}`);
      toast.success("Branch deleted");
      setConfirmDelete(null);
      fetchBranches();
      fetchMapData();
    } catch (error) {
      console.error("DELETE BRANCH ERROR:", error);
      toast.error(error.response?.data?.message || "Unable to delete branch");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Branches
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Demo business branches across Nepal — seeded for demonstration purposes.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition cursor-pointer"
        >
          <FaPlus size={14} />
          Add Branch
        </button>
      </div>

      {branches.length > 0 && (
        <div id="branch-map" className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="font-semibold text-gray-800 dark:text-white text-sm">Branch Locations — Nepal</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">{branches.length} branches</span>
          </div>
          <NepalBranchMap branches={mapData.length ? mapData : branches} height={340} selectedId={selectedBranchId} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <FaSpinner className="animate-spin mr-2" /> Loading branches...
        </div>
      ) : branches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 py-16 text-center text-gray-500 dark:text-gray-400">
          No branches yet. Add your first branch to see it here and on the map.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div
              key={branch._id}
              className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {branch.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {branch.city}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    branch.status === "active"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
                  }`}
                >
                  {branch.status}
                </span>
              </div>

              {branch.address && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  {branch.address}
                </p>
              )}
              {branch.phone && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {branch.phone}
                </p>
              )}
              <button
                onClick={() => focusBranchOnMap(branch)}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <FaMapMarkerAlt size={11} /> Show on map
              </button>

              <div className="mt-4 flex items-center gap-2 border-t border-gray-100 dark:border-slate-800 pt-3">
                <button
                  onClick={() => openEditModal(branch)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <FaEdit size={13} /> Edit
                </button>
                <button
                  onClick={() => setConfirmDelete(branch)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <FaTrash size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  {editingBranch ? "Edit Branch" : "Add Branch"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Branch name (e.g. Kathmandu Central)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="city"
                  list="nepal-cities"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City (pick one to place the pin automatically)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <datalist id="nepal-cities">
                  {Object.keys(NEPAL_CITIES).map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    type="number"
                    step="any"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    type="number"
                    step="any"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {coordsFromCity && (
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Coordinates filled in from the city center — click the map to move the pin to the exact spot.
                  </p>
                )}
                <LocationPickerMap
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onPick={handlePickOnMap}
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-transparent dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition disabled:opacity-60 cursor-pointer"
                >
                  {saving ? "Saving..." : editingBranch ? "Save Changes" : "Add Branch"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ConfirmModal
        isOpen={!!confirmDelete}
        title="Delete Branch"
        message={`Are you sure you want to delete ${confirmDelete?.name}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default Branches;
