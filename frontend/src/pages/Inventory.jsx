import { useState } from "react";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaPlus,
  FaBoxes,
  FaWarehouse,
} from "react-icons/fa";

const Inventory = () => {
  // =========================
  // INVENTORY DATA
  // =========================

  const [inventory, setInventory] = useState([
    {
      id: 1,
      product: "Gaming Laptop",
      category: "Electronics",
      sku: "LAP-001",
      warehouse: "Main Warehouse",
      stock: 12,
      minStock: 5,
      status: "In Stock",
    },
    {
      id: 2,
      product: "Wireless Mouse",
      category: "Accessories",
      sku: "MOU-002",
      warehouse: "Kathmandu Warehouse",
      stock: 54,
      minStock: 10,
      status: "In Stock",
    },
    {
      id: 3,
      product: "Mechanical Keyboard",
      category: "Accessories",
      sku: "KEY-003",
      warehouse: "Main Warehouse",
      stock: 30,
      minStock: 10,
      status: "In Stock",
    },
    {
      id: 4,
      product: "Monitor 27 Inch",
      category: "Electronics",
      sku: "MON-004",
      warehouse: "Kathmandu Warehouse",
      stock: 9,
      minStock: 10,
      status: "Low Stock",
    },
    {
      id: 5,
      product: "USB Hub",
      category: "Accessories",
      sku: "USB-005",
      warehouse: "Biratnagar Warehouse",
      stock: 0,
      minStock: 10,
      status: "Out of Stock",
    },
  ]);

  // =========================
  // STATES
  // =========================

  const [search, setSearch] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);

  const [outOfStockMessage, setOutOfStockMessage] = useState("");

  const [newItem, setNewItem] = useState({
    product: "",
    category: "",
    sku: "",
    warehouse: "",
    stock: "",
    minStock: "",
  });

  // =========================
  // SEARCH
  // =========================

  const filteredInventory = inventory.filter((item) => {
    const searchText = search.toLowerCase();

    return (
      item.product.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.sku.toLowerCase().includes(searchText) ||
      item.warehouse.toLowerCase().includes(searchText) ||
      item.status.toLowerCase().includes(searchText)
    );
  });

  // =========================
  // ADD INVENTORY
  // =========================

  const handleAddInventory = (e) => {
    e.preventDefault();

    if (
      !newItem.product.trim() ||
      !newItem.category.trim() ||
      !newItem.sku.trim() ||
      !newItem.warehouse ||
      newItem.stock === "" ||
      newItem.minStock === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    const stockNumber = Number(newItem.stock);
    const minStockNumber = Number(newItem.minStock);

    let status = "In Stock";

    if (stockNumber === 0) {
      status = "Out of Stock";
    } else if (stockNumber <= minStockNumber) {
      status = "Low Stock";
    }

    // =========================
    // OUT OF STOCK MESSAGE
    // =========================

    if (stockNumber === 0) {
      setOutOfStockMessage(
        `${newItem.product} is currently out of stock at ${newItem.warehouse}. Please restock this item before processing orders.`
      );
    } else {
      setOutOfStockMessage("");
    }

    const newInventoryItem = {
      id: Date.now(),
      product: newItem.product.trim(),
      category: newItem.category.trim(),
      sku: newItem.sku.trim(),
      warehouse: newItem.warehouse,
      stock: stockNumber,
      minStock: minStockNumber,
      status: status,
    };

    setInventory((previousInventory) => [
      ...previousInventory,
      newInventoryItem,
    ]);

    // Reset form

    setNewItem({
      product: "",
      category: "",
      sku: "",
      warehouse: "",
      stock: "",
      minStock: "",
    });

    setShowAddForm(false);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (id) => {
    const item = inventory.find(
      (inventoryItem) => inventoryItem.id === id
    );

    if (!item) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${item.product}?`
    );

    if (!confirmDelete) {
      return;
    }

    setInventory((previousInventory) =>
      previousInventory.filter(
        (inventoryItem) => inventoryItem.id !== id
      )
    );
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (item) => {
    const updatedProduct = window.prompt(
      "Enter product name:",
      item.product
    );

    if (updatedProduct === null) {
      return;
    }

    if (!updatedProduct.trim()) {
      alert("Product name cannot be empty.");
      return;
    }

    setInventory((previousInventory) =>
      previousInventory.map((inventoryItem) =>
        inventoryItem.id === item.id
          ? {
              ...inventoryItem,
              product: updatedProduct.trim(),
            }
          : inventoryItem
      )
    );
  };

  // =========================
  // CLOSE WARNING
  // =========================

  const closeWarning = () => {
    setOutOfStockMessage("");
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="space-y-6">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg">
            <FaBoxes size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Inventory
            </h1>

            <p className="text-gray-500 dark:text-gray-400">
              Manage your inventory and stock levels
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <FaPlus />
          Add Inventory
        </button>

      </div>

      {/* =====================================
          OUT OF STOCK WARNING
      ====================================== */}

      {outOfStockMessage && (
        <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800">

          <div className="w-11 h-11 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-300 text-xl flex-shrink-0">
            ⚠️
          </div>

          <div className="flex-1">

            <h3 className="font-bold text-red-700 dark:text-red-300 text-lg">
              Out of Stock
            </h3>

            <p className="text-red-600 dark:text-red-400 mt-1">
              {outOfStockMessage}
            </p>

          </div>

          <button
            type="button"
            onClick={closeWarning}
            className="text-red-500 hover:text-red-700 text-xl font-bold"
          >
            ✕
          </button>

        </div>
      )}

      {/* =====================================
          ADD INVENTORY FORM
      ====================================== */}

      {showAddForm && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-6">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Add Inventory Item
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Add a new product to your warehouse
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              ✕
            </button>

          </div>

          <form
            onSubmit={handleAddInventory}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >

            {/* Product */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Product Name
              </label>

              <input
                type="text"
                value={newItem.product}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    product: e.target.value,
                  })
                }
                placeholder="Enter product name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>

              <input
                type="text"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    category: e.target.value,
                  })
                }
                placeholder="Enter category"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SKU */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                SKU
              </label>

              <input
                type="text"
                value={newItem.sku}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    sku: e.target.value,
                  })
                }
                placeholder="Example: LAP-001"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Warehouse */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Warehouse
              </label>

              <div className="relative">

                <FaWarehouse className="absolute left-4 top-4 text-gray-400" />

                <select
                  value={newItem.warehouse}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      warehouse: e.target.value,
                    })
                  }
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select Warehouse
                  </option>

                  <option value="Main Warehouse">
                    Main Warehouse
                  </option>

                  <option value="Kathmandu Warehouse">
                    Kathmandu Warehouse
                  </option>

                  <option value="Biratnagar Warehouse">
                    Biratnagar Warehouse
                  </option>

                </select>

              </div>
            </div>

            {/* Current Stock */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Current Stock
              </label>

              <input
                type="number"
                min="0"
                value={newItem.stock}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    stock: e.target.value,
                  })
                }
                placeholder="Enter stock quantity"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-xs text-gray-500 mt-1">
                Enter 0 if this item is currently out of stock.
              </p>
            </div>

            {/* Minimum Stock */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Minimum Stock
              </label>

              <input
                type="number"
                min="0"
                value={newItem.minStock}
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    minStock: e.target.value,
                  })
                }
                placeholder="Enter minimum stock"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Buttons */}

            <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-3 pt-2">

              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-5 py-3 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 font-semibold transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Add Inventory
              </button>

            </div>

          </form>

        </div>
      )}

      {/* =====================================
          SEARCH
      ====================================== */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-5">

        <div className="relative w-full md:w-96">

          <FaSearch className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            placeholder="Search product, SKU, warehouse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* =====================================
          INVENTORY TABLE
      ====================================== */}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50 dark:bg-slate-800">

              <tr>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  Product
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  Category
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  SKU
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  Warehouse
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  Stock
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  Min Stock
                </th>

                <th className="text-left p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  Status
                </th>

                <th className="text-center p-4 text-gray-700 dark:text-gray-200 font-semibold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredInventory.map((item) => (

                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
                >

                  {/* Product */}

                  <td className="p-4">

                    <div className="font-semibold text-gray-800 dark:text-white">
                      {item.product}
                    </div>

                  </td>

                  {/* Category */}

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {item.category}
                  </td>

                  {/* SKU */}

                  <td className="p-4">

                    <span className="font-mono text-sm text-gray-600 dark:text-gray-300">
                      {item.sku}
                    </span>

                  </td>

                  {/* Warehouse */}

                  <td className="p-4">

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">

                      <FaWarehouse className="text-blue-500" />

                      {item.warehouse}

                    </div>

                  </td>

                  {/* Stock */}

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full font-semibold ${
                        item.stock === 0
                          ? "bg-red-100 text-red-700"
                          : item.stock <= item.minStock
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.stock}
                    </span>

                  </td>

                  {/* Minimum Stock */}

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {item.minStock}
                  </td>

                  {/* Status */}

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === "Out of Stock"
                          ? "bg-red-100 text-red-700"
                          : item.status === "Low Stock"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  {/* Actions */}

                  <td className="p-4">

                    <div className="flex justify-center gap-3">

                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-3 rounded-lg transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 p-3 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* No Results */}

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">

            <FaBoxes className="mx-auto text-gray-300 text-5xl mb-4" />

            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              No Inventory Found
            </h3>

            <p className="text-gray-400 mt-1">
              Try changing your search.
            </p>

          </div>
        )}

      </div>

    </div>
  );
};

export default Inventory;