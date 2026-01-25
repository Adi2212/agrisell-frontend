import {
    Home as HomeIcon,
    Users,
    Package,
    Tag,
    ShoppingCart,
} from "lucide-react";

export const adminMenu = [
    { label: "Dashboard", icon: HomeIcon, route: "/admin/dashboard" },
    { label: "Manage Farmers", icon: Users, route: "/admin/farmers" },
    { label: "Manage Buyers", icon: Users, route: "/admin/buyers" },
    { label: "Products", icon: Package, route: "/admin/products" },
    { label: "Categories", icon: Tag, route: "/admin/categories" },
    { label: "Orders", icon: ShoppingCart, route: "/admin/orders" },
];

export const buyerMenu = [
    { label: "Home", icon: HomeIcon, route: "/" },
    { label: "Categories", icon: Tag, route: "/categories" },
    { label: "Orders", icon: ShoppingCart, route: "/buyer/orders" },
    { label: "Cart", icon: ShoppingCart, route: "/buyer/cart" },
];

export const farmerMenu = [
    { label: "Dashboard", icon: HomeIcon, route: "/farmer/dashboard" },
    { label: "Add Product", icon: Package, route: "/farmer/products/add" },
    { label: "My Products", icon: Package, route: "/farmer/products" },
    { label: "Orders", icon: ShoppingCart, route: "/farmer/orders" },
];
