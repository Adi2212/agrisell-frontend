import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CartContext } from "@/context/CartContext";
import { WishlistContext } from "@/context/WishlistContext";
import { productApi } from "@/api/api";
import { reviewApi } from "@/api/api";

import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";
import { ShoppingCart, Heart, Sparkles, Tag } from "lucide-react";
import StarRating from "@/components/StarRating";
import { toast } from "sonner";
import { formatOrderDate } from "@/lib/utils";

export default function ProductInfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const isLoggedIn = sessionStorage.getItem("token") !== null;

  // Fetch Product
  useEffect(() => {
    productApi.get(`/get/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  // Fetch Reviews
  const fetchReviews = () => {
    reviewApi.get(`/product/${id}`).then((res) => {
      setReviews(res.data);
    });
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // Submit Review
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

  // Calculate Average Rating
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
        onCartClick={() => navigate("/buyer/cart")}
      >
        <div className="flex justify-center items-center h-64 text-muted-foreground">
          Loading product...
        </div>
      </Layout>
    );

  const hasOffer = Boolean(
    product.offer &&
    product.discountedPrice !== undefined &&
    product.discountedPrice !== null &&
    product.discountedPrice < product.price
  );
  const displayPrice = hasOffer ? product.discountedPrice : product.price;

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/buyer/cart");
  };

  return (
    <Layout
      title="Product Info"
      menuItems={buyerMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
      cartIcon={ShoppingCart}
      onCartClick={() => navigate("/buyer/cart")}
    >
      {/* Product Info */}
      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative">
          <img
            src={product.imgUrl}
            alt={product.name}
            className="w-full rounded-2xl shadow-md border object-contain max-h-[460px] bg-muted/40"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/500?text=Product";
            }}
          />
          {hasOffer && (
            <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold px-3 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1.5 tracking-wide">
              <Sparkles className="w-4 h-4" />
              {product.offer.discountPercentage}% OFF
            </span>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-muted-foreground mt-1">
            {product.parentCategory?.name && product.category?.name && product.parentCategory.name !== product.category.name
              ? `${product.parentCategory.name} > ${product.category.name}`
              : product.category?.name || "General"}
          </p>

          {/* Special Offer Callout Banner */}
          {hasOffer && (
            <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50/80 dark:bg-red-950/30 dark:border-red-900/60 flex items-start gap-3 shadow-sm">
              <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-red-600 dark:text-red-400">
                    Special Offer: {product.offer.title}
                  </span>
                  <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {product.offer.discountPercentage}% OFF
                  </span>
                </div>
                {product.offer.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.offer.description}
                  </p>
                )}
              </div>
            </div>
          )}

          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Pricing */}
          <div className="mt-6">
            {hasOffer ? (
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="line-through text-muted-foreground text-2xl font-normal">
                    ₹{product.price}
                  </span>
                  <h2 className="text-4xl font-extrabold text-primary">
                    ₹{displayPrice}
                  </h2>
                </div>
                <p className="text-sm font-semibold text-emerald-600 mt-1">
                  You save ₹{(product.price - displayPrice).toFixed(2)} ({product.offer.discountPercentage}% discount applied)
                </p>
              </div>
            ) : (
              <h2 className="text-4xl font-bold text-primary">
                ₹{product.price}
              </h2>
            )}
          </div>

          {/* Average Rating */}
          <div className="mt-4">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Rating: <span className="text-foreground font-bold">{avgRating} ⭐</span> ({reviews.length} reviews)
            </h3>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-7 py-3 rounded-xl transition shadow active:scale-95"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>

            <button
              className="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold px-7 py-3 rounded-xl transition shadow-sm active:scale-95"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            <button
              className="border border-primary text-primary hover:bg-primary/10 px-4 py-3 rounded-xl flex items-center justify-center transition shadow-sm active:scale-95"
              onClick={() => addToWishlist(product.id || product.productId)}
              title="Save to Wishlist"
            >
              <Heart size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>

        {/* Add Review Form */}
        {isLoggedIn ? (
          <div className="p-6 border rounded-xl shadow-sm mb-8 bg-card">
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
              className="border px-3 py-2 rounded-lg w-full mb-3 bg-background"
            />

            <button
              onClick={handleSubmitReview}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Submit Review
            </button>
          </div>
        ) : (
          <p className="text-muted-foreground mb-6">
            Please login to write a review.
          </p>
        )}

        {/* Display Reviews */}
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-4 border rounded-xl shadow-sm bg-card"
              >
                <h4 className="font-semibold">
                  {r.buyerName} ⭐ {r.rating}/5
                </h4>
                <p className="text-muted-foreground mt-1">{r.comment}</p>
                <p className="text-xs text-muted-foreground/70 mt-2">
                  {formatOrderDate(r.createdAt)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
