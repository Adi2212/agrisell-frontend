import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";
import { ShoppingCart } from "lucide-react";



export default function Home() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
   
    




    return (
        <Layout
            title="AgriSell"
            menuItems={buyerMenu}
            onLogout={() => {
                sessionStorage.clear();
                navigate("/");
            }}
            showSearch={true}
            searchValue={search}
            onSearchChange={setSearch}
            cartIcon={ShoppingCart}
            onCartClick={() => navigate("/customer/cart")}
        >

        
            {/* Product grid */}
            <main className="p-6 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               
            </main>
        </Layout>
    );
}
