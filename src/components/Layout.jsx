import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({
  title,
  menuItems,
  children,
  onLogout,
  showSearch = false,
  searchValue = "",
  onSearchChange = () => {},
  cartIcon: CartIcon,
  onCartClick = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        menuItems={menuItems}
        title={title}
        onLogout={onLogout}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="flex flex-col flex-1">
        <Navbar
          title={title}
          toggleSidebar={() => setIsOpen(!isOpen)}
          showSearch={showSearch}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          cartIcon={CartIcon}
          onCartClick={onCartClick}
           onProfileClick={() => navigate("/profile")}
        />

        <main className="flex-1 p-4 lg:ml-64">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
