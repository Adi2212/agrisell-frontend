import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({
  title,
  menuItems,
  children,
  showSearch = false,
  searchValue = "",
  onSearchChange = () => {},
  cartIcon,
  onCartClick = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        title={title}
        menuItems={menuItems}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Navbar
          title={title}
          toggleSidebar={() => setIsOpen(!isOpen)}
          showSearch={showSearch}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          cartIcon={cartIcon}
          onCartClick={onCartClick}
        />

        <main className="flex-1 p-4">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
