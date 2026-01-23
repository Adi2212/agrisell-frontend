import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function Sidebar({ menuItems, title, isOpen, setIsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-background border-r
      transform transition-transform duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Header */}
      <div className="h-16 px-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="AgriSell Logo" className="h-8 w-8 rounded-full" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <button className="lg:hidden" onClick={() => setIsOpen(false)}>
          ✕
        </button>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2 text-sm">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(item.route);
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer
              hover:bg-secondary/10 transition
              ${
                location.pathname === item.route
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
          >
            <item.icon size={18} />
            {item.label}
          </div>
        ))}
      </nav>
    </aside>
  );
}
