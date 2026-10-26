import React, { useState, useEffect } from "react";
import { adminApi } from "@/api/api";
import Layout from "@/components/Layout";
import { adminMenu } from "@/constants/Menus";
import { useNavigate } from "react-router-dom";
import { BadgePercent, Plus } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting state
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const size = 10;
  const navigate = useNavigate();

  // Load products when page or sorting changes
  useEffect(() => {
    loadProducts();
  }, [page, sortField, sortDirection]);

  // Sorting handler
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(0);
  };

  // Fetch products with pagination
  const loadProducts = async () => {
    try {
      const res = await adminApi.get(
        `/products?page=${page}&size=${size}&sort=${sortField},${sortDirection}`
      );

      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.error("Failed to load products:", err);
    }
  };

  // Search filter (current page only)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Delete product
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await adminApi.delete(`/products/${id}`);
      loadProducts();
    }
  };

  return (
    <Layout
      title="Products"
      menuItems={adminMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
    >
      <main className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold">Manage Products</h1>
          <button
            onClick={() => navigate("/admin/offers")}
            className="flex items-center gap-2 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-semibold text-xs rounded-lg transition"
          >
            <BadgePercent className="w-4 h-4" />
            Manage Sale Offers
          </button>
        </div>

        {/* Search */}
        <input
          className="w-full mb-4 p-2 border rounded bg-background"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Products Table */}
        <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted text-primary">
              <tr>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  Product{" "}
                  {sortField === "name" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>

                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("farmerName")}
                >
                  Farmer{" "}
                  {sortField === "farmerName" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>

                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("price")}
                >
                  Price{" "}
                  {sortField === "price" &&
                    (sortDirection === "asc" ? "▲" : "▼")}
                </th>

                <th className="p-3 text-left">Active Offer</th>

                <th className="p-3 text-center">Stock</th>

                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredProducts.length ? (
                filteredProducts.map((product) => {
                  const hasOffer = !!product.offerTitle;
                  return (
                    <tr key={product.id} className="hover:bg-muted/40 transition">
                      <td className="p-3 font-medium text-foreground">{product.name}</td>
                      <td className="p-3 text-muted-foreground">{product.farmerName}</td>
                      <td className="p-3">
                        {hasOffer && product.discountedPrice < product.price ? (
                          <div>
                            <span className="font-bold text-emerald-600">
                              ₹{product.discountedPrice}
                            </span>
                            <span className="line-through text-xs text-muted-foreground ml-1.5">
                              ₹{product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="font-medium">₹{product.price}</span>
                        )}
                      </td>

                      {/* Active Offer Column */}
                      <td className="p-3">
                        {hasOffer ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-xs text-foreground">
                              {product.offerTitle}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500 text-white">
                              {product.discountPercentage}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">No Offer</span>
                        )}
                      </td>

                      <td className="p-3 text-center font-medium">{product.stock}</td>

                      {/* Delete Button */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-muted-foreground">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-xs font-semibold"
          >
            Previous
          </button>

          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages || 1}
          </span>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-xs font-semibold"
          >
            Next
          </button>
        </div>
      </main>
    </Layout>
  );
}
