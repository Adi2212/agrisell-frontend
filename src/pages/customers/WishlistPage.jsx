import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";
import { WishlistContext } from "@/context/WishlistContext";
import { CartContext } from "@/context/CartContext";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist, moveToCart } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    // This handles moving the item to the cart without clearing from cart context specifically
    const handleMoveToCart = (item) => {
        moveToCart(item.id);
        // addToCart will locally update the cart since we don't have socket sync right away
        addToCart(item);
    };

    return (
        <Layout
            title="My Wishlist"
            menuItems={buyerMenu}
            onLogout={() => {
                sessionStorage.clear();
                navigate("/");
            }}
            cartIcon={ShoppingCart}
            onCartClick={() => navigate("/buyer/cart")}
        >
            <div className="p-6 max-w-3xl mx-auto space-y-4">
                {/* EMPTY WISHLIST MESSAGE */}
                {wishlist.length === 0 && (
                    <div className="text-center mt-10">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-muted-foreground">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mt-2">Save items you like to buy later!</p>
                    </div>
                )}

                {/* WISHLIST ITEMS */}
                {wishlist.map((item) => (
                    <Card
                        key={item.id}
                        className="flex items-center justify-between bg-card border rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        <CardContent className="p-4 w-full flex items-center justify-between">
                            {/* LEFT: IMAGE + NAME */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.imgUrl}
                                    alt={item.name}
                                    className="w-16 h-16 object-contain rounded-md cursor-pointer"
                                    onClick={() => navigate(`/product/${item.id}`)}
                                />

                                <div>
                                    <h2 className="font-semibold text-lg text-card-foreground cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                        {item.name}
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        ₹{item.price}
                                    </p>
                                </div>
                            </div>

                            {/* RIGHT: MOVE TO CART & DELETE BUTTON */}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => handleMoveToCart(item)}
                                    className="text-primary hover:bg-muted font-semibold"
                                >
                                    Move to Cart
                                </Button>

                                <Button
                                    variant="destructive"
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="text-destructive-foreground bg-destructive/90 hover:bg-destructive/80"
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 size={20} />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Layout>
    );
}
