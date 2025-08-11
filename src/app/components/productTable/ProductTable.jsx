"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { MoreHorizontal, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import AddProductForm from "./addProduct/page";

const parseMoney = (v) => {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const parseMetric = (v) => {
  if (typeof v === "number") return v;
  if (!v) return 0;
  const s = String(v).trim().toLowerCase();
  const m = s.match(/([0-9]*\.?[0-9]+)/);
  if (!m) return 0;
  const num = parseFloat(m[1]);
  return s.includes("k") ? num * 1000 : num;
};
const fromLocalProduct = (p) => ({
  id: p.id,
  name: p.name,
  productCode: p.sku,
  category: p.category,
  brandName: p.brand,
  brandColor: "#6B7280",
  price: typeof p.price === "number" ? p.price : parseMoney(p.price),
  stockStatus: p.status,
  stockQuantity: String(p.stock ?? 0),
  views: "0",
  viewsChange: "0%",
  viewsChangeType: "increase",
});

export default function ProductTable() {
  const [products, setProducts] = useState([]); // table-shape
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    try {
      // 1) local cache for the table view
      let stored;
      try {
        stored = JSON.parse(localStorage.getItem("products") || "[]");
      } catch {
        stored = [];
        localStorage.setItem("products", JSON.stringify([]));
      }
      if (Array.isArray(stored) && stored.length) {
        setProducts(stored);
        return;
      }

      // 2) server API -> always returns localProducts shape
      const res = await fetch("/api/local-products", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const localProducts = await res.json();

      const list = (localProducts || []).map(fromLocalProduct);
      setProducts(list);
      localStorage.setItem("products", JSON.stringify(list));
      setError(null);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(`Failed to load products: ${err.message}`);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const handleDelete = (id) => {
    try {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem("products", JSON.stringify(updated));
    } catch (err) {
      setError(`Failed to delete product: ${err.message}`);
    }
  };

  const filtered = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.brandName?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.productCode?.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortField) return 0;
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "price") {
      aVal = parseMoney(aVal);
      bVal = parseMoney(bVal);
    } else if (sortField === "views" || sortField === "stockQuantity") {
      aVal = parseMetric(aVal);
      bVal = parseMetric(bVal);
    } else {
      aVal = (aVal ?? "").toString().toLowerCase();
      bVal = (bVal ?? "").toString().toLowerCase();
    }

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const pageItems = sorted.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortOrder === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  return (
    <div className="w-full p-0 bg-zinc-800 text-gray-100 px-8 pt-1">
      <div className="w-full overflow-x-auto">
        {error && <div className="p-4 bg-red-600 text-white rounded-md mb-4">{error}</div>}
        {products.length === 0 && !error && (
          <div className="p-4 bg-yellow-600 text-white rounded-md mb-4">
            No products available. Add a product to get started.
          </div>
        )}

        <div className="flex items-center justify-between p-4 border border-zinc-700 bg-zinc-900 rounded-xl mb-4">
          <h1 className="text-lg font-semibold">Products Table</h1>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 text-sm border border-zinc-700 bg-zinc-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                  {productToEdit ? "Edit Product" : "Add Product"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border border-zinc-700 text-white max-w-xl">
                <AddProductForm
                  productToEdit={productToEdit}
                  onClose={() => {
                    setIsDialogOpen(false);
                    setProductToEdit(null);
                    fetchProducts();
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Table className="w-full text-sm text-gray-300 border border-zinc-700 rounded-xl">
          <TableHeader className="bg-zinc-800">
            <TableRow>
              <TableHead className="w-12 px-4 py-2 rounded-tl-xl"><Checkbox /></TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center gap-1 px-0">NAME {renderSortIcon("name")}</Button></TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("category")} className="flex items-center gap-1 px-0">CATEGORY {renderSortIcon("category")}</Button></TableHead>
              <TableHead>BRAND</TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("price")} className="flex items-center gap-1 px-0">PRICE {renderSortIcon("price")}</Button></TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("stockQuantity")} className="flex items-center gap-1 px-0">STOCK {renderSortIcon("stockQuantity")}</Button></TableHead>
              <TableHead><Button variant="ghost" onClick={() => handleSort("views")} className="flex items-center gap-1 px-0">VIEWS {renderSortIcon("views")}</Button></TableHead>
              <TableHead className="w-12 px-4 text-right rounded-tr-xl"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {pageItems.map((product) => (
              <TableRow key={product.id} className="hover:bg-zinc-700 transition">
                <TableCell className="px-4"><Checkbox /></TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-lg bg-gray-300 flex items-center justify-center text-black font-semibold uppercase">
                      {product.name?.slice(0, 2) || "--"}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{product.name || "N/A"}</div>
                      <div className="text-xs text-gray-400">{product.productCode || "—"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{product.category || "N/A"}</TableCell>
                <TableCell>
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: product.brandColor || "#6B7280", color: "white" }}>
                    {product.brandName || "N/A"}
                  </div>
                </TableCell>
                <TableCell>${parseMoney(product.price).toFixed(2)}</TableCell>
                <TableCell>
                  <div className={`font-medium ${
                    product.stockStatus === "Available" ? "text-green-500" :
                    product.stockStatus === "Limited Supply" ? "text-yellow-400" : "text-red-500"
                  }`}>
                    {product.stockStatus || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">{product.stockQuantity || 0}</div>
                </TableCell>
                <TableCell>
                  <div>{product.views || 0}</div>
                  <div className={`flex items-center text-xs ${product.viewsChangeType === "increase" ? "text-green-400" : "text-red-400"}`}>
                    {product.viewsChangeType === "increase" ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {product.viewsChange || "0%"}
                  </div>
                </TableCell>
                <TableCell className="text-right px-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-800">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-zinc-900 border border-zinc-700 text-gray-100">
                      <DropdownMenuItem onClick={() => { setProductToEdit(product); setIsDialogOpen(true); }}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(product.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border border-zinc-700 bg-zinc-900 rounded-xl mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" onClick={() => handlePageChange(currentPage - 1)} /></PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink href="#" isActive={currentPage === i + 1} onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem><PaginationNext href="#" onClick={() => handlePageChange(currentPage + 1)} /></PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-sm text-gray-400">
            {sorted.length === 0 ? 0 : indexOfFirstItem + 1} - {Math.min(indexOfLastItem, sorted.length)} of {sorted.length} entries
          </div>
        </div>
      </div>
    </div>
  );
}

