import { FaFlask } from "react-icons/fa";

/**
 * A small, deliberately visible pill shown whenever a chart/section is
 * rendering fallback demo data instead of real backend data — so a viewer
 * never mistakes placeholder numbers for actual business figures.
 */
const DemoDataBadge = () => (
  <span
    title="This section is showing sample data because there isn't enough real data yet"
    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40"
  >
    <FaFlask size={10} /> Demo data
  </span>
);

export default DemoDataBadge;
