"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("⚠️ All fields are required.");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.email === form.email);
    if (exists) {
      alert("⚠️ Email already registered.");
      return;
    }

    const hashedPassword = await bcrypt.hash(form.password, 10);
    users.push({ ...form, password: hashedPassword });
    localStorage.setItem("users", JSON.stringify(users));

    alert("✅ Registration successful!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-zinc-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-white mb-6">🔐 Sign Up</h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full p-2 rounded bg-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full p-2 rounded bg-zinc-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSignUp}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition font-semibold"
          >
            Create Account
          </button>

          <p className="text-sm text-center text-gray-400 mt-2">
            Already have an account?{" "}
            <span
              className="text-blue-400 hover:underline cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

