"use client";

import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import SidebarCollapsed from "../components/sidebar/SidebarExpanded";
import { useState } from "react";

export default function ThankYouPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-900 flex-col">
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white shadow-lg flex flex-col">
          <div className="flex justify-end p-3">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-white hover:text-red-500 text-2xl"
            >
              ✕
            </button>
          </div>
          <SidebarCollapsed />
        </div>
      )}

      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="p-6 text-white text-center mt-12">
        <h1 className="text-4xl font-bold mb-4">🎉 Thank You!</h1>
        <p className="text-gray-300 mb-6">
          Your order has been placed successfully.
        </p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
