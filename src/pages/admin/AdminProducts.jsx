import React, { useState, useEffect } from "react";
import { adminApi } from "@/api/api";
import Layout from "@/components/Layout";
import { adminMenu } from "@/constants/Menus";
import { useNavigate } from "react-router-dom";

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
    const res = await adminApi.get(
      `/products?page=${page}&size=${size}&sort=${sortField},${sortDirection}`
    );

    setProducts(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  // Search filter (current page only)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Delete product
  const deleteProduct = async (id) => {
    await adminApi.delete(`/products/${id}`);
    loadProducts();
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
        <h1 className="text-2xl font-semibold mb-4">Manage Products</h1>

        {/* Search */}
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Products Table */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-muted text-primary">
            <tr>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Product{" "}
                {sortField === "name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("farmerName")}
              >
                Farmer{" "}
                {sortField === "farmerName" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("price")}
              >
                Price{" "}
                {sortField === "price" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th className="p-2">Stock</th>

              {/* <th className="p-2">Status</th> */}

              <th className="p-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {filteredProducts.length ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">{product.farmerName}</td>
                  <td className="p-2">₹{product.price}</td>
                  <td className="p-2">{product.stock}</td>

                  {/* Status Badge */}
                  {/* <td className="p-2">
                    <span
                      className={`px-2 rounded text-white ${
                        product.approved
                          ? "bg-green-600"
                          : "bg-yellow-600"
                      }`}
                    >
                      {product.approved ? "Approved" : "Pending"}
                    </span>
                  </td> */}

                  {/* Delete Button */}
                  <td className="p-2 text-right">
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-muted rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </main>
    </Layout>
  );
}
