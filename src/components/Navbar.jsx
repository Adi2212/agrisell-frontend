import { Menu, Search, User } from "lucide-react";
import { Input } from "./ui/input";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({
  title,
  toggleSidebar,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  cartIcon: CartIcon,
  onCartClick,
}) {
  const navigate = useNavigate();

  const isLoggedIn = !!sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))
    : null;

  return (
    <header className="h-16 bg-background border-b sticky top-0 z-30 flex items-center px-4">
      
      {/* LEFT */}
      <div className="flex items-center gap-3 w-1/4">
        <button className="lg:hidden" onClick={toggleSidebar}>
          <Menu size={22} />
        </button>
        {/* <h1 className="text-lg font-semibold">{title}</h1> */}
      </div>

      {/* CENTER */}
      <div className="flex-1 flex justify-center">
        {showSearch && (
          <div className="relative w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-full"
            />
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-3 w-1/4">
        {CartIcon && (
          <button
            onClick={onCartClick}
            className="p-2 rounded-full hover:bg-secondary/10 transition"
          >
            <CartIcon size={18} />
          </button>
        )}

        {!isLoggedIn ? (
          <Link
            to="/login"
            className="px-4 py-2 text-sm border rounded-full hover:bg-secondary/10"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={() => navigate("/account")}
            className="w-9 h-9 rounded-full overflow-hidden border flex items-center justify-center bg-muted hover:ring-2 hover:ring-primary"
          >
            {user?.profileUrl ? (
              <img
                src={user.profileUrl}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src = "/default-avatar.png")
                }
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
