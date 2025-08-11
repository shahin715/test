"use client";

import { useCart } from "@/app/context/CartContext";
import Navbar from "../components/navbar/Navbar";
import SidebarCollapsed from "../components/sidebar/SidebarExpanded";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", address: "" });

  const router = useRouter();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleConfirmOrder = () => {
    if (!form.name || !form.email || !form.address) {
      alert("Please fill in all fields.");
      return;
    }

    alert("✅ Order Confirmed!");
    router.push("/thankYou");
  };

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white flex-col">
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 shadow-lg flex flex-col">
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

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="p-6 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl font-bold mb-6">🧾 Checkout</h1>

          {cartItems.length === 0 ? (
            <p className="text-gray-400 text-center">Your cart is empty.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div className="bg-zinc-800 p-6 rounded-lg shadow space-y-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${item.price * item.quantity}</span>
                  </div>
                ))}
                <hr className="border-zinc-700" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${total}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="bg-zinc-800 p-6 rounded-lg shadow space-y-4">
                <h2 className="text-xl font-semibold mb-2">Shipping Info</h2>

                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring focus:ring-blue-500"
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring focus:ring-blue-500"
                />

                <textarea
                  name="address"
                  placeholder="Shipping Address"
                  value={form.address}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 rounded bg-zinc-700 border border-zinc-600 focus:outline-none focus:ring focus:ring-blue-500"
                />

                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg font-semibold"
                >
                  Confirm Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

