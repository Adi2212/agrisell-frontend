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
    { label: "Add Category", icon: Tag, route: "/admin/add-category" },
    { label: "Orders", icon: ShoppingCart, route: "/admin/orders" },
];

export const buyerMenu = [
    { label: "Home", icon: HomeIcon, route: "/" },
    { label: "Orders", icon: ShoppingCart, route: "/customer/orders" },
    { label: "Cart", icon: ShoppingCart, route: "/customer/cart" },
];

export const farmerMenu = [
    { label: "Dashboard", icon: HomeIcon, route: "/farmer/dashboard" },
    { label: "Add Product", icon: Package, route: "/farmer/add-product" },
    { label: "My Products", icon: Package, route: "/farmer/products" },
    { label: "Orders", icon: ShoppingCart, route: "/farmer/orders" },
];
