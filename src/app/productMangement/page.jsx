"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import SidebarCollapsed from "../components/sidebar/SidebarCollapsed";
import SidebarExpanded from "../components/sidebar/SidebarExpanded";
import Navbar from "../components/navbar/Navbar";

// ==== API base (optional) ====
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.trim();

// ==== Helpers to normalize different shapes (like your db.json) ====
function parsePrice(v) {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function parseStock(v) {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const s = String(v).toLowerCase();
  const m = s.match(/([\d.]+)\s*(k)?/);
  if (!m) return 0;
  const base = parseFloat(m[1] || "0");
  return m[2] === "k" ? Math.round(base * 1000) : Math.round(base);
}
function normalizeFromApi(arr) {
  return (arr || []).map((p) => ({
    id: p.id || p.productCode || crypto.randomUUID(),
    name: p.name || p.title || "",
    sku: p.sku || p.SKU || p.productCode || "",
    brand: p.brand || p.brandName || "",
    category: p.category || p.type || "",
    price: parsePrice(p.price),
    status: p.status || p.stockStatus || "Active",
    stock: parseStock(p.stock ?? p.stockQuantity ?? p.quantity),
    description: p.description || p.desc || "",
    image: p.image || p.img || p.imageUrl || "",
  }));
}

// Safe demo fallback so the table never looks empty if API/static file fail
const SAMPLE_SEED = [
  { id: "S-1", name: "Demo Shoes", sku: "DEMO-001", brand: "Flexo", category: "Footwear", price: 49.99, status: "Active", stock: 15, description: "Sample product", image: "" },
  { id: "S-2", name: "Demo Tee", sku: "DEMO-002", brand: "Cottonly", category: "Clothing", price: 14.99, status: "Active", stock: 30, description: "Sample product", image: "" },
  { id: "S-3", name: "Demo Mouse", sku: "DEMO-003", brand: "LogiTech", category: "Electronics", price: 19.99, status: "Low Stock", stock: 5, description: "Sample product", image: "" }
];

const emptyForm = {
  id: "",
  name: "",
  sku: "",
  brand: "",
  category: "",
  price: "",
  status: "Active",
  stock: "",
  description: "",
  image: "",
};

const CATEGORIES = ["Footwear", "Clothing", "Electronics", "Accessories", "Home", "Beauty", "Other"];
const STATUSES = ["Active", "Inactive", "Low Stock", "Out of Stock", "Draft"];

export default function ProductCrudPage() {
  // ==== Shell state (layout) ====
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  // ==== Data state ====
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selected, setSelected] = useState(null);
  const fileInputRef = useRef(null);

  // ==== Bootstrap data: localStorage -> /db.json -> API ====
  useEffect(() => {
    if (typeof window === "undefined") return;

    // migrate old key ("products") to new ("localProducts") once
    try {
      const old = localStorage.getItem("products");
      const hasNew = localStorage.getItem("localProducts");
      if (!hasNew && old) {
        localStorage.setItem("localProducts", old);
        localStorage.removeItem("products");
      }
    } catch {}

    (async () => {
      // 1) Try localStorage first
      try {
        const saved = localStorage.getItem("localProducts");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length) {
            setProducts(parsed);
            return;
          }
        }
      } catch {}

      // helper fetchers
      const fetchDbJson = async () => {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/db.json?v=${Date.now()}`, { cache: "no-store" });
          if (!res.ok) return [];
          const data = await res.json();
          const list = data.localProducts || data.products || data.inventory?.localProducts || data.inventory?.products || data.items || [];
          return normalizeFromApi(list);
        } catch {
          return [];
        }
      };
      const fetchApi = async () => {
        if (!API_BASE) return [];
        try {
          const res = await fetch(`${API_BASE}/localProducts`, { cache: "no-store" });
          if (!res.ok) return [];
          const list = await res.json();
          return normalizeFromApi(list);
        } catch {
          return [];
        }
      };

      // 2) Prefer /db.json, then API
      const fromFile = await fetchDbJson();
      if (fromFile.length) {
        setProducts(fromFile);
        return;
      }
      const fromApi = await fetchApi();
      setProducts(fromApi.length ? fromApi : SAMPLE_SEED);
    })();
  }, []);

  // Persist on every change (even empty array)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("localProducts", JSON.stringify(products));
    } catch (e) {
      console.warn("localStorage save failed", e);
    }
  }, [products]);

  // ==== Derived list (filter + search) ====
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const inSearch = `${p.name} ${p.sku} ${p.brand} ${p.category}`.toLowerCase().includes(search.toLowerCase());
      const inCat = filterCategory === "All" ? true : p.category === filterCategory;
      return inSearch && inCat;
    });
  }, [products, search, filterCategory]);

  // ==== CRUD handlers ====
  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, id: crypto.randomUUID() });
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({ ...p });
    setShowModal(true);
  };
  const saveProduct = (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name is required");
    if (editingId) {
      setProducts((prev) => prev.map((x) => (x.id === editingId ? { ...form, id: editingId } : x)));
    } else {
      setProducts((prev) => [{ ...form }, ...prev]);
    }
    setShowModal(false);
    setEditingId(null);
  };
  const removeProduct = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts((prev) => prev.filter((x) => x.id !== id));
    if (selected?.id === id) {
      setShowDrawer(false);
      setSelected(null);
    }
  };
  const onView = (p) => {
    setSelected(p);
    setShowDrawer(true);
  };
  const onFilePick = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  // ==== UI ====
  return (
    <div className="flex min-h-screen w-full bg-zinc-900 text-white overflow-hidden">
      {/* SidebarCollapsed - always visible on desktop */}
      <div className="hidden lg:flex fixed top-0 left-0 w-20 h-full bg-zinc-900 border-r border-zinc-800 z-40">
        <SidebarCollapsed />
      </div>

      {/* SidebarExpanded - toggled on mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-zinc-800 shadow-lg flex flex-col">
          <div className="flex justify-end p-3">
            <button onClick={toggleSidebar} className="text-white hover:text-red-500 text-2xl">✕</button>
          </div>
          <SidebarExpanded />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto lg:ml-20">
        {/* Navbar with hamburger toggle */}
        <Navbar onToggleSidebar={toggleSidebar} />

        {/* Page body */}
        <div className="min-h-[calc(100vh-56px)] bg-zinc-800 p-6">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <h1 className="text-2xl font-semibold tracking-tight">Product Management</h1>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm shadow-sm text-white"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full sm:w-64 rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm shadow-sm text-white placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={openCreate}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
                >
                  + Add Product
                </button>
              </div>
            </div>

            {/* Mobile list (<md) */}
            <div className="md:hidden grid gap-3">
              {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-600">
                    <td className="px-4 py-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover ring-1 ring-gray-400" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-500 text-xs text-gray-300 ring-1 ring-gray-400">IMG</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 hidden lg:table-cell">{p.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-300 hidden md:table-cell">{p.category}</td>
                    <td className="px-4 py-3 text-sm text-white">${Number(p.price || 0).toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs hidden sm:table-cell"><span className="rounded-full bg-zinc-500 px-2 py-1 text-gray-100">{p.status}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-300 hidden lg:table-cell">{p.stock}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <button type="button" onClick={() => onView(p)} className="rounded-lg border border-gray-400 px-3 py-1.5 text-xs sm:text-sm hover:bg-zinc-500">View</button>
                        <button type="button" onClick={() => openEdit(p)} className="rounded-lg border border-gray-400 px-3 py-1.5 text-xs sm:text-sm hover:bg-zinc-500">Edit</button>
                        <button type="button" onClick={() => removeProduct(p.id)} className="rounded-lg border border-red-400 px-3 py-1.5 text-xs sm:text-sm text-red-400 hover:bg-red-900">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-zinc-700 bg-zinc-700 p-6 text-center text-sm text-gray-300">
                  No products found or API failed.
                  <div className="mt-3">
                    <button type="button" onClick={() => setProducts(SAMPLE_SEED)} className="rounded-xl border border-zinc-600 px-3 py-1.5 hover:bg-zinc-800">Load demo data</button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop table (≥ md) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-700 bg-zinc-700 shadow-sm">
              <table className="min-w-[900px] w-full divide-y divide-zinc-600">
                <thead className="bg-zinc-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200">Image</th>
                    <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200">Name</th>
                    <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200 hidden lg:table-cell">SKU</th>
                    <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200 hidden md:table-cell">Category</th>
                    <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200">Price</th>
                    <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200 hidden sm:table-cell">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200 hidden lg:table-cell">Stock</th>
                    <th className="px-4 py-3 text-right text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-600">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-600">
                      <td className="px-4 py-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-10 w-10 rounded-md object-cover ring-1 ring-gray-400" />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-500 text-xs text-gray-300 ring-1 ring-gray-400">IMG</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-white">{p.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{p.sku}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{p.category}</td>
                      <td className="px-4 py-3 text-sm text-white">${Number(p.price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs"><span className="rounded-full bg-zinc-500 px-2 py-1 text-gray-100">{p.status}</span></td>
                      <td className="px-4 py-3 text-sm text-gray-300">{p.stock}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => onView(p)} className="rounded-lg border border-gray-400 px-3 py-1.5 text-sm hover:bg-zinc-500">View</button>
                          <button type="button" onClick={() => openEdit(p)} className="rounded-lg border border-gray-400 px-3 py-1.5 text-sm hover:bg-zinc-500">Edit</button>
                          <button type="button" onClick={() => removeProduct(p.id)} className="rounded-lg border border-red-400 px-3 py-1.5 text-sm text-red-400 hover:bg-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">
                        No products found or API failed.
                        <div className="mt-3">
                          <button type="button" onClick={() => setProducts(SAMPLE_SEED)} className="rounded-xl border border-zinc-600 px-3 py-1.5 text-sm hover:bg-zinc-800">Load demo data</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-zinc-900 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-700 p-4">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Product" : "Add Product"}</h2>
              <button type="button" onClick={() => setShowModal(false)} className="rounded-full p-2 hover:bg-zinc-800">✕</button>
            </div>

            <form onSubmit={saveProduct} className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              {/* Image uploader */}
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Image</label>
                <div className="flex items-center gap-4 rounded-xl border border-dashed border-zinc-600 p-4">
                  {form.image ? (
                    <img src={form.image} alt="preview" className="h-20 w-20 rounded-md object-cover ring-1 ring-zinc-600" />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-md bg-zinc-800 text-xs text-gray-300 ring-1 ring-zinc-700">Preview</div>
                  )}
                  <div className="space-y-2">
                    <input ref={fileInputRef} type="file" accept="image/*" className="block text-sm" onChange={(e) => onFilePick(e.target.files?.[0])} />
                    <p className="text-xs text-gray-400">PNG/JPG up to ~2MB (stored as base64 for demo)</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-gray-400" placeholder="Product name" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">SKU</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-gray-400" placeholder="00001" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Brand</label>
                <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-gray-400" placeholder="Brand" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm">
                  <option value="">Select…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Price</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-gray-400" placeholder="0.00" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Stock</label>
                <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-gray-400" placeholder="0" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-3 py-2 text-sm text-white placeholder-gray-400" placeholder="Short details" />
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-zinc-600 px-4 py-2 text-sm hover:bg-zinc-800">Cancel</button>
                <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer: View details */}
      <div className={`fixed inset-y-0 right-0 z-[55] w-full max-w-full md:max-w-md transform bg-zinc-900 text-white shadow-2xl transition-transform duration-300 ${showDrawer ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-zinc-700 p-4">
          <h3 className="text-base font-semibold">Product Details</h3>
          <button type="button" onClick={() => setShowDrawer(false)} className="rounded-full p-2 hover:bg-zinc-800">✕</button>
        </div>
        {selected ? (
          <div className="space-y-4 p-4">
            {selected.image && (
              <img src={selected.image} alt={selected.name} className="h-52 w-full rounded-xl object-cover" />
            )}
            <div>
              <h4 className="text-xl font-semibold">{selected.name}</h4>
              <p className="text-sm text-gray-400">SKU: {selected.sku}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Brand" value={selected.brand} />
              <Info label="Category" value={selected.category} />
              <Info label="Price" value={`$${Number(selected.price || 0).toFixed(2)}`} />
              <Info label="Status" value={selected.status} />
              <Info label="Stock" value={selected.stock} />
            </div>
            <div>
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-gray-300">{selected.description || "—"}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => openEdit(selected)} className="rounded-xl border border-zinc-600 px-3 py-2 text-sm hover:bg-zinc-800">Edit</button>
              <button type="button" onClick={() => removeProduct(selected.id)} className="rounded-xl border border-red-500 px-3 py-2 text-sm text-red-400 hover:bg-red-900">Delete</button>
            </div>
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-400">Select a product to view details.</div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-medium text-white">{String(value || "—")}</p>
    </div>
  );
}
