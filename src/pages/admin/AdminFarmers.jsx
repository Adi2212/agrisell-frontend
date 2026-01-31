import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/api";
import Layout from "../../components/Layout";
import { adminMenu } from "../../constants/Menus";
import { useNavigate } from "react-router-dom";

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Sorting state
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");

  const size = 10;
  const navigate = useNavigate();

  // Load farmers when page or sorting changes
  useEffect(() => {
    loadFarmers();
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

  // Fetch farmers from backend with pagination + sorting
  const loadFarmers = async () => {
    const res = await adminApi.get(
      `/farmers?page=${page}&size=${size}&sort=${sortField},${sortDirection}`
    );

    setFarmers(res.data.content);
    setTotalPages(res.data.totalPages);
  };

  // Search filter (only current page data)
  const filteredFarmers = farmers.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle farmer status
  const changeStatus = async (id) => {
    await adminApi.put(`/farmers/${id}/status`);
    loadFarmers();
  };

  return (
    <Layout
      title="Farmers"
      menuItems={adminMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
    >
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Manage Farmers</h1>

        {/* Search */}
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Search farmers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Farmers Table */}
        <table className="w-full border rounded-lg overflow-hidden">
          <thead className="bg-muted text-primary">
            <tr>
              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortField === "name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                className="p-2 cursor-pointer"
                onClick={() => handleSort("phone")}
              >
                Phone{" "}
                {sortField === "phone" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th className="p-2">Products</th>

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
            {filteredFarmers.length ? (
              filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className="border-b">
                  <td className="p-2">{farmer.name}</td>
                  <td className="p-2">{farmer.phone}</td>
                  <td className="p-2">{farmer.productCount}</td>

                  {/* Status Badge */}
                  <td className="p-2">
                    <span
                      className={`px-2 rounded text-white ${
                        farmer.accStatus === "ACTIVE"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {farmer.accStatus}
                    </span>
                  </td>

                  {/* Action Button */}
                  <td className="p-2 text-right">
                    <button
                      onClick={() => changeStatus(farmer.id)}
                      className={`px-3 py-1 rounded text-white ${
                        farmer.accStatus === "ACTIVE"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {farmer.accStatus === "ACTIVE" ? "Block" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500">
                  No farmers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
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
