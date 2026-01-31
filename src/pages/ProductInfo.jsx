import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CartContext } from "@/context/CartContext";
import { productApi } from "@/api/api";
import { reviewApi } from "@/api/api";

import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";
import { ShoppingCart } from "lucide-react";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";

export default function ProductInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);

  //  Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isLoggedIn = sessionStorage.getItem("token") !== null;

  //  Fetch Product
  useEffect(() => {
    productApi.get(`/get/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  //  Fetch Reviews
  const fetchReviews = () => {
    reviewApi.get(`/product/${id}`).then((res) => {
      setReviews(res.data);
    });
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  //  Submit Review
  const handleSubmitReview = async () => {
    try {
      await reviewApi.post(`/add/${id}`, {
        rating,
        comment,
      });

      toast.success("Review added successfully!");

      setComment("");
      setRating(5);

      fetchReviews(); // refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  //  Calculate Average Rating
  const avgRating =
    reviews.length > 0
      ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1)
      : "No ratings yet";

  if (!product)
    return (
      <Layout
        title="Product Dashboard"
        menuItems={buyerMenu}
        onLogout={() => {
          sessionStorage.clear();
          navigate("/");
        }}
        cartIcon={ShoppingCart}
        onCartClick={() => navigate("/cart")}
      >
        Loading product...
      </Layout>
    );

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
      {/*  Product Info */}
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
              ₹{product.price + 20}
            </span>
            <h2 className="text-4xl font-bold text-primary">
              ₹{product.price}
            </h2>
          </div>

          {/*  Average Rating */}
          <div className="mt-4">
            <h3 className="font-semibold">
              Rating: {avgRating} ⭐ ({reviews.length} reviews)
            </h3>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="bg-primary text-white px-6 py-3 rounded-lg"
              onClick={() => alert("Proceed to Buy")}
            >
              Buy Now
            </button>

            <button
              className="bg-primary/80 text-secondary px-6 py-3 rounded-lg"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/*  Review Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {/*  Add Review Form */}
        {/*  Show review form only if logged in */}
        {isLoggedIn ? (
          <div className="p-6 border rounded-xl shadow-sm mb-8">
            <h3 className="text-lg font-semibold mb-2">Write a Review</h3>

            {/* ⭐ Star Rating */}
            <div className="mb-4">
              <p className="font-medium mb-1">
                Your Rating: {rating} / 5
              </p>

              <StarRating rating={rating} setRating={setRating} />
            </div>

            {/* Comment */}
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              className="border px-3 py-2 rounded-lg w-full mb-3"
            />

            <button
              onClick={handleSubmitReview}
              className="bg-primary text-white px-5 py-2 rounded-lg"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-muted-foreground mb-6">
            Please login to write a review.
          </p>
        )}


        {/*  Display Reviews */}
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 border rounded-xl shadow-sm"
              >
                <h4 className="font-semibold">
                  {r.buyerName} ⭐ {r.rating}/5
                </h4>
                <p className="text-muted-foreground">{r.comment}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
