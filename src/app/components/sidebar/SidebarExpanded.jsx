"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  LogOut,
  User,
  X
} from "lucide-react";
import { useAuth } from "@/app/context/authContext";

export default function SidebarExpanded({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
      pathname === path
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:text-white hover:bg-zinc-800"
    }`;

  return (
    <aside className="h-full w-64 bg-zinc-900 text-white border-r border-zinc-800 p-4 flex flex-col justify-between relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Top Section */}
      <div>
        <h1 className="text-lg font-semibold mb-6 px-2">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/" className={linkClass("/")}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/products" className={linkClass("/products")}>
            <Package className="w-5 h-5" />
            Products
          </Link>
          <Link href="/cart" className={linkClass("/cart")}>
            <ShoppingCart className="w-5 h-5" />
            Cart
          </Link>
        </nav>
      </div>

      {/* Bottom Section - Mobile Auth Button */}
      <div className="sm:hidden mt-6">
        {user ? (
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-red-400 hover:bg-zinc-700 w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-800 text-gray-400 hover:bg-zinc-700 w-full"
          >
            <User className="w-5 h-5" />
            Login
          </button>
        )}
      </div>
    </aside>
  );
}

