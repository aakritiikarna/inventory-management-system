import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen
        flex
        bg-gray-50
        dark:bg-slate-950
        text-gray-800
        dark:text-white
        transition-colors
        duration-300
      "
    >
      {/* SIDEBAR */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* RIGHT SIDE */}

      <div className="flex-1 min-w-0 flex flex-col">

        {/* NAVBAR */}

        <Navbar />

        {/* CONTENT */}

        <main
          className="
            flex-1
            p-4
            md:p-6
            bg-gray-50
            dark:bg-slate-950
            transition-colors
            duration-300
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;