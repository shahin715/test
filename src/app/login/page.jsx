"use client";

import { useState } from "react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find((u) => u.email === form.email.trim());
    if (!user) {
      setError("❌ User not found");
      return;
    }

    const match = await bcrypt.compare(form.password, user.password);
    if (!match) {
      setError("❌ Incorrect password");
      return;
    }

    login(user);
    alert("✅ Login successful");
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md bg-zinc-800 p-6 rounded-lg shadow-lg space-y-5">
        <h2 className="text-3xl font-bold text-center text-white">🔓 Login</h2>

        {error && (
          <div className="bg-red-600 text-white text-sm p-2 rounded text-center">
            {error}
          </div>
        )}

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full px-4 py-2 bg-zinc-700 rounded text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 bg-zinc-700 rounded text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-2 right-3 text-gray-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-500 hover:underline cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
