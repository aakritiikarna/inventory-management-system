import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
    <div className="text-center max-w-sm">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center mx-auto mb-5">
        <FaLock size={22} />
      </div>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Access restricted</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
        You don't have permission to view this page. Contact an administrator if you believe this is a mistake.
      </p>
      <Link
        to="/admin-dashboard"
        className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:opacity-90 transition"
      >
        Back to dashboard
      </Link>
    </div>
  </div>
);

export default Unauthorized;
