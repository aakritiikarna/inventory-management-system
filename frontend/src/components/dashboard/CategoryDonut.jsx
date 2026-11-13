import DonutChart from "./DonutChart";
import DemoDataBadge from "../common/DemoDataBadge";
import { useDashboard } from "../../context/DashboardContext";
import { DEMO_CATEGORY_SALES } from "../../data/demoData";

const CategoryDonut = () => {
  const { categoryCounts, loading } = useDashboard();

  const realData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  const usingDemo = !loading && realData.length === 0;
  const data = usingDemo
    ? DEMO_CATEGORY_SALES.map((d) => ({ name: d.name, value: d.products }))
    : realData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-6 h-full">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">Category Mix</h2>
        {usingDemo && <DemoDataBadge />}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Products by category</p>

      {loading ? (
        <div className="h-[200px] rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      ) : (
        <DonutChart data={data} centerLabel="Products" />
      )}
    </div>
  );
};

export default CategoryDonut;
