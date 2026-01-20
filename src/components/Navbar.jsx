import { Menu, Search, User } from "lucide-react";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({
  title,
  toggleSidebar,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  onCartClick,
  cartIcon: CartIcon
}) {
  const navigate = useNavigate();

  const isLoggedIn = !!sessionStorage.getItem("token");

  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  const profileUrl = user?.profileUrl;

  return (
    <header className="bg-background shadow-sm sticky top-0 z-30 flex items-center justify-between px-4 py-4 border-b">

      {/* LEFT */}
      <div className="flex items-center gap-3">
        <button className="lg:hidden" onClick={toggleSidebar}>
          <Menu className="text-gray-700" size={22} />
        </button>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      {/* CENTER */}
      {showSearch && (
        <div className="flex items-center gap-3 w-1/2">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-3 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>

          {CartIcon && (
            <button
              onClick={onCartClick}
              className="bg-background text-foreground px-3 py-2 rounded-full hover:bg-secondary/10 transition"
            >
              <CartIcon size={18} />
            </button>
          )}
        </div>
      )}

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {!isLoggedIn ? (
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium border rounded-full hover:bg-secondary/10 transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={() => navigate("/account")}
            className="w-9 h-9 rounded-full overflow-hidden border hover:ring-2 hover:ring-primary transition flex items-center justify-center bg-muted"
          >
            {profileUrl ? (
              <img
                src={profileUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/default-avatar.png";
                }}
              />
            ) : (
              <User size={18} />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
