import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";


export default function Sidebar({ menuItems, title, onLogout, isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();


  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-background border-r shadow-md
      transform transition-transform duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      <div className="p-4 border-b flex items-center gap-2">
        <img src={logo} alt="AgriSell Logo" className="h-8 w-8 rounded-full" />
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>✕</button>
      </div>

      <nav className="p-4 space-y-3 text-muted-foreground">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(item.route);
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer 
            hover:bg-secondary/10 hover:text-foreground
            ${location.pathname === item.route ? "bg-secondary font-semibold" : ""}`}
          >
            <item.icon size={18} /> {item.label}
          </div>
        ))}
        {/* Logout code  */}
        {/* 
        {user && (
  <div
    className="flex items-center gap-3 p-2 cursor-pointer rounded-md
               hover:bg-secondary/10 hover:text-foreground mt-6 text-red-600"
    onClick={logout}
  >
    <LogOut size={18} /> Logout
  </div>
)} */}

      </nav>
    </aside>
  );
}
