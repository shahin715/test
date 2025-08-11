"use client";

import { Menu, Search, Bell, ShoppingCart, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/authContext";

export default function Navbar({ onToggleSidebar }) {
  const router = useRouter();
  const { cartItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="flex h-12 sm:h-16 items-center bg-zinc-900 text-white border-b border-zinc-800 px-2 sm:px-4">
      {/* Left Section - Hamburger */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-400 h-9 w-9"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </div>

      {/* Middle - Search (hidden on small screens) */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right Section - Icons (show on all screens) */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Bell Icon */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-400" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500" />
        </Button>

        {/* Cart Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => router.push("/cart")}
        >
          <ShoppingCart className="h-5 w-5 text-gray-400" />
          {cartItems.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-600 text-xs rounded-full h-4 w-4 flex items-center justify-center text-white">
              {cartItems.length}
            </span>
          )}
        </Button>

        {/* Auth Button */}
        {user ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="h-5 w-5 text-red-400" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/login")}
            title="Login"
          >
            <User className="h-5 w-5 text-gray-400" />
          </Button>
        )}
      </div>
    </header>
  );
}

