/**
 * Signature status indicator used across the app for supplier status,
 * PO status, low-stock flags, etc: a colored dot + uppercase mono
 * label, echoing the look of physical warehouse bin tags.
 */
const COLOR_MAP = {
  ACTIVE: "bg-emerald-500 text-emerald-700 bg-emerald-50",
  INACTIVE: "bg-slate-400 text-slate-600 bg-slate-100",
  DRAFT: "bg-amber-500 text-amber-700 bg-amber-50",
  APPROVED: "bg-sky-500 text-sky-700 bg-sky-50",
  RECEIVED: "bg-emerald-500 text-emerald-700 bg-emerald-50",
  CANCELLED: "bg-rose-500 text-rose-700 bg-rose-50",
  LOW: "bg-rose-500 text-rose-700 bg-rose-50",
  OK: "bg-emerald-500 text-emerald-700 bg-emerald-50",
};

export default function StatusBadge({ status }) {
  const classes = COLOR_MAP[status] || "bg-slate-400 text-slate-600 bg-slate-100";
  const [dotColor, textColor, bgColor] = classes.split(" ");

  return (
    <span className={`badge ${textColor} ${bgColor} font-mono`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor} mr-1.5`} />
      {status}
    </span>
  );
}
