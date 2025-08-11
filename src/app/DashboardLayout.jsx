"use client";

import React, { useState } from "react";
import Navbar from "./components/navbar/Navbar";
import SidebarCollapsed from "./components/sidebar/SidebarCollapsed";
import SidebarExpanded from "./components/sidebar/SidebarExpanded";

const DashboardLayout = ({ children }) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="relative flex w-full h-screen overflow-hidden bg-zinc-800">
      {/* SidebarCollapsed - only visible on lg+ screens */}
      <div className="hidden lg:flex fixed top-0 left-0 w-20 h-full z-40 bg-gray-900">
        <SidebarCollapsed />
      </div>

      {/* SidebarExpanded - toggled via navbar */}
      {isSidebarExpanded && (
        <div
          className="fixed top-0 h-full z-50 w-64 bg-zinc-900 transition-transform duration-300
                     lg:left-20 left-0"
        >
          <SidebarExpanded onClose={toggleSidebar} />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 h-full w-full transition-all duration-300 ${
          isSidebarExpanded ? "lg:ml-[20rem]" : "lg:ml-20"
        }`}
      >
        <Navbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;






