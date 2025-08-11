"use client";

import { useCart } from "@/app/context/CartContext";
import Navbar from "../components/navbar/Navbar";
import SidebarCollapsed from "../components/sidebar/SidebarExpanded";
import { useState } from "react";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart, decreaseQuantity } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const goToCheckout = () => {
    router.push("/checkout");
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 flex-col">
      {/* Sidebar */}
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

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={toggleSidebar} />

        <div className="p-6 text-white">
          <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-400">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-800 text-white rounded-lg p-4 flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    <img
                      loading="lazy"
                      src={item.image?.src || item.image}
                      alt={item.name}
                      className="h-20 w-20 object-contain rounded"
                    />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-gray-300">${item.price}</p>
                      <div className="flex items-center mt-2 gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-zinc-700 hover:bg-zinc-600 text-white p-2 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 />
                  </button>
                </div>
              ))}

              {/* Total and Checkout */}
              <div className="flex flex-col sm:flex-row justify-between items-center bg-zinc-800 p-4 rounded-lg mt-4 gap-4">
                <h2 className="text-xl font-bold">Total: ${total}</h2>
                <button
                  onClick={goToCheckout}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded w-full sm:w-auto"
                >
                  Check Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

