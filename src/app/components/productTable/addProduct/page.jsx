"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AddProductForm({ onClose, productToEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    category: "",
    price: "",
    stockQuantity: "",
    stockStatus: "Available",  
    views: "0",
    viewsChange: "0%",
    viewsChangeType: "increase",
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productsData = JSON.parse(localStorage.getItem("products")) || [];

      let updatedProducts = [...productsData];

      if (productToEdit?.id) {
        updatedProducts = updatedProducts.map((product) =>
          product.id === productToEdit.id ? { ...product, ...formData } : product
        );
      } else {
        const newProduct = { ...formData, id: Date.now().toString() };
        updatedProducts.push(newProduct);
      }

      localStorage.setItem("products", JSON.stringify(updatedProducts));

      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-xl font-semibold mb-4">
        {productToEdit ? "Edit Product" : "Add New Product"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        {["name", "brandName", "category", "price", "stockQuantity"].map((field) => (
          <input
            key={field}
            name={field}
            type={field === "price" || field === "stockQuantity" ? "number" : "text"}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
          />
        ))}

        {/* Dropdown for Stock Status */}
        <select
          name="stockStatus"
          value={formData.stockStatus}
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-zinc-800 border border-zinc-700"
        >
          <option value="Available">Available</option>
          <option value="Limited Supply">Limited Supply</option>
          <option value="Not Available">Not Available</option>
        </select>

        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {productToEdit ? "Update Product" : "Submit Product"}
        </Button>
      </form>
    </div>
  );
}
