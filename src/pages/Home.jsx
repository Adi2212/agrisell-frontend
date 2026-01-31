import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { productApi } from "@/api/api";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { buyerMenu } from "@/constants/Menus";
import { ShoppingCart } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import BannerSlider from "@/components/BannerSlider";

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = sessionStorage.getItem("token");
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productApi.get("/get", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(shuffleArray(res.data));
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};


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
      <BannerSlider />

      {/* MAIN CONTENT */}
      <main className="p-6">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center text-lg text-muted-foreground">
            Loading products...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex justify-center items-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Products */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigate(`/product/${product.id}`)}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
          </div>
        )}
      </main>
    </Layout>
  );
}
