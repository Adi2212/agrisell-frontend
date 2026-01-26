import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/api";
import Layout from "../../components/Layout";
import { adminMenu } from "../../constants/menus";
import { useNavigate } from "react-router-dom";

export default function AdminBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting state
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const size = 10;
  const navigate = useNavigate();

  // Load buyers when page or sorting changes
  useEffect(() => {
    loadBuyers();
  }, [page, sortField, sortDirection]);

  // Handle sorting click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setPage(0);
  };

  // Fetch buyers from backend with pagination + sorting
  const loadBuyers = async () => {
    const res = await adminApi.get(
      `/buyers?page=${page}&size=${size}&sort=${sortField},${sortDirection}`
    );

    setBuyers(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  // Search filter (only current page)
  const filteredBuyers = buyers.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle buyer active/inactive
  const changeStatus = async (id) => {
    await adminApi.put(`/buyers/${id}/status`);
    loadBuyers();
  };

  return (
    <Layout
      title="Buyers"
      menuItems={adminMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
    >
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Manage Buyers</h1>

        {/* Search */}
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Search buyers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Buyers Table */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-muted text-primary">
            <tr>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortField === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                Email {sortField === "email" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th className="p-2">Orders</th>
              <th className="p-2">Spent</th>

              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("accStatus")}
              >
                Status{" "}
                {sortField === "accStatus" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-center">
            {filteredBuyers.length ? (
              filteredBuyers.map((buyer) => (
                <tr key={buyer.id} className="border-b">
                  <td className="p-2">{buyer.name}</td>
                  <td className="p-2">{buyer.email}</td>
                  <td className="p-2">{buyer.orderCount}</td>
                  <td className="p-2">₹{buyer.totalSpent}</td>

                  <td className="p-2">
                    <span
                      className={`px-2 rounded text-white ${
                        buyer.accStatus === "ACTIVE"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {buyer.accStatus}
                    </span>
                  </td>

                  <td className="p-2 text-right">
                    <button
                      onClick={() => changeStatus(buyer.id)}
                      className={`px-3 py-1 rounded text-white ${
                        buyer.accStatus === "ACTIVE"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {buyer.accStatus === "ACTIVE" ? "Block" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  No buyers found
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
