import { useContext, useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { CartContext } from "@/context/CartContext";
import { productApi } from "@/api/api";
import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";
import { ShoppingCart } from "lucide-react";

export default function ProductInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    productApi.get(`/get/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <Layout
            title="Product Dashboard"
      menuItems={buyerMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}

      cartIcon={ShoppingCart}
      onCartClick={() => navigate("/cart")}
    >Loading product...</Layout>;

  return (
    <Layout
            title="Product Info"
      menuItems={buyerMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
      cartIcon={ShoppingCart}
      onCartClick={() => navigate("/cart")}
    >
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img
            src={product.imgUrl}
            className="w-full rounded-xl shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">{product.category?.name}</p>

          <p className="mt-4 text-lg">{product.description}</p>

          <div className="mt-6">
            <span className="line-through text-muted-foreground text-xl">
              ₹{product.price + 500}
            </span>
            <h2 className="text-4xl font-bold text-primary">
              ₹{product.price}
            </h2>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              className="bg-primary text-white px-6 py-3 rounded-lg"
              onClick={() => alert("Proceed to Buy")}
            >
              Buy Now
            </button>

            <button
              className="bg-primary/80 text-secondary px-6 py-3 rounded-lg"
              onClick={() => addToCart(product)}   // <-- add to cart here
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
