import { useState } from "react";
import { reportsApi } from "../api/endpoints";
import { extractErrorMessage, useToast } from "../hooks/useToast";

const REPORTS = [
  { key: "stock", label: "Stock Report", path: "/reports/stock/", description: "Current stock levels across all warehouses." },
  { key: "suppliers", label: "Supplier Report", path: "/reports/suppliers/", description: "All suppliers and how many products they supply." },
  { key: "warehouses", label: "Warehouse Report", path: "/reports/warehouses/", description: "Capacity and utilization per warehouse." },
  { key: "purchase-orders", label: "Purchase Order Report", path: "/reports/purchase-orders/", description: "All purchase orders and their totals." },
];

export default function Reports() {
  const toast = useToast();
  const [downloadingKey, setDownloadingKey] = useState(null);

  const handleDownload = async (report, format) => {
    setDownloadingKey(`${report.key}-${format}`);
    try {
      await reportsApi.download(report.path, { format }, `${report.key}_report.${format === "excel" ? "xlsx" : "csv"}`);
      toast.success(`${report.label} downloaded`);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setDownloadingKey(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {REPORTS.map((report) => (
        <div key={report.key} className="card">
          <h3 className="text-sm font-semibold text-ink-900">{report.label}</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">{report.description}</p>
          <div className="flex gap-2">
            <button
              className="btn-secondary"
              onClick={() => handleDownload(report, "csv")}
              disabled={downloadingKey === `${report.key}-csv`}
            >
              {downloadingKey === `${report.key}-csv` ? "Exporting..." : "Export CSV"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleDownload(report, "excel")}
              disabled={downloadingKey === `${report.key}-excel`}
            >
              {downloadingKey === `${report.key}-excel` ? "Exporting..." : "Export Excel"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
