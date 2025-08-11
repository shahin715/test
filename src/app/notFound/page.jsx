"use client";

import { useState } from "react";
import SidebarCollapsed from "../components/sidebar/SidebarCollapsed";
import SidebarExpanded from "../components/sidebar/SidebarExpanded";
import Navbar from "../components/navbar/Navbar";
import Link from "next/link";

export default function NotFound() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen w-full bg-zinc-900 text-white overflow-hidden">
      {/* SidebarCollapsed - always visible on desktop */}
      <div className="hidden lg:flex fixed top-0 left-0 w-20 h-full bg-zinc-900 border-r border-zinc-800 z-40">
        <SidebarCollapsed />
      </div>

      {/* SidebarExpanded - toggled on mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 shadow-lg flex flex-col">
          <div className="flex justify-end p-3">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-red-500 text-2xl"
            >
              ✕
            </button>
          </div>
          <SidebarExpanded />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto lg:ml-20">
        {/* Navbar with hamburger toggle */}
        <Navbar onToggleSidebar={toggleSidebar} />

        <div className="flex flex-col items-center justify-center flex-grow px-4 py-8 text-center">
          <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
