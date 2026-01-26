import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { buyerMenu, farmerMenu, adminMenu } from "@/constants/menus";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Edit } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AccountDetails() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ Use context logout

  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser.role === "BUYER") setMenu(buyerMenu);
    else if (parsedUser.role === "FARMER") setMenu(farmerMenu);
    else if (parsedUser.role === "ADMIN") setMenu(adminMenu);

  }, [navigate]);

  if (!user) return null;

  const { name, email, phone, role, accStatus, profileUrl } = user;

  
  const handleLogout = () => {
    logout(); 
    //navigate("/", { replace: true });
  };

  return (
    <Layout title="Account Details" menuItems={menu} onLogout={handleLogout}>
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-background border rounded-lg shadow-sm p-6">

          {/* Profile Header */}
          <div className="flex items-center gap-6 border-b pb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
              {profileUrl ? (
                <img
                  src={profileUrl + "?t=" + Date.now()}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = "/default-avatar.png")
                  }
                />
              ) : (
                <User size={40} />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="text-muted-foreground">{email}</p>

              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                  accStatus === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {accStatus}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Detail label="Full Name" value={name} />
            <Detail label="Email" value={email} />
            <Detail label="Phone" value={phone || "—"} />
            <Detail label="Role" value={role} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => navigate("/account/edit")}
              className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-secondary/10 transition"
            >
              <Edit size={16} />
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
