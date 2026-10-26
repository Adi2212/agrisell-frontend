import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart, PlusIcon, MinusIcon, Heart } from "lucide-react";
import { userApi, orderApi } from "@/api/api";
import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/Menus";
import { CartContext } from "@/context/CartContext";
import { WishlistContext } from "@/context/WishlistContext";

import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { he } from "zod/v4/locales";

export default function CartPage() {
    const navigate = useNavigate();
    const { cart, updateQty, removeFromCart, addToCart } =
        useContext(CartContext);
    const { wishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);

    const handleMoveToCart = (item) => {
        addToCart(item);
        removeFromWishlist(item.id);
    };

    const handleRemove = (item) => {
        removeFromCart(item.id);

        toast.error("Item removed", {
            description: `${item.name} removed from cart`,
            duration: 4000,
            action: {
                label: "Undo",
                onClick: () => addToCart(item),
            },
        });
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    const proceedOrder = () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Please login to proceed", { duration: 3000 });
            navigate("/");
            return;
        }

        // Step 1: Create Order (PENDING_PAYMENT)
        const orderData = {
            paymentMethod: "STRIPE",
            items: cart.map((item) => ({
                product: { productId: item.id },
                quantity: item.qty,
            })),
        };

        orderApi.post("/create", orderData)
            .then(async (res) => {
                const order = res.data;
                const orderId = order.orderId;
                const items = order.items;


                // Step 2: Create Stripe Checkout Session
                const paymentReq = {
                    orderId: orderId,
                    items: items

                };
                console.log("Payment Request:", paymentReq);

                const paymentRes = await userApi.post("payments/checkout", paymentReq);

                if (paymentRes.data.status === "SUCCESS") {
                    window.location.href = paymentRes.data.sessionUrl;
                } else {
                    toast.error(paymentRes.data.message || "Payment failed");
                }


            })
            .catch((err) => {
                console.error("Order placement failed:", err);
                toast.error("Failed to create order. Please try again.", { duration: 3000 });
            });
    };



    return (
        <Layout
            title="My Cart"
            menuItems={buyerMenu}
            onLogout={() => {
                sessionStorage.clear();
                navigate("/");
            }}
            cartIcon={ShoppingCart}
            onCartClick={() => navigate("/cart")}
        >
            <div className="p-6 max-w-3xl mx-auto space-y-4">
                {/* EMPTY CART MESSAGE */}
                {cart.length === 0 && (
                    <p className="text-muted-foreground text-center text-lg">
                        Your cart is empty.
                    </p>
                )}

                {/* CART ITEMS */}
                {cart.map((item) => (
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
                                    className="w-16 h-16 object-contain rounded-md"
                                />

                                <div>
                                    <h2 className="font-semibold text-lg text-card-foreground">
                                        {item.name}
                                    </h2>
                                    <p className="text-muted-foreground text-sm">
                                        ₹{item.price}
                                    </p>
                                </div>
                            </div>

                            {/* MIDDLE: QTY CONTROLS */}
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-lg min-w-[20px] text-center">
                                    {item.qty}
                                </span>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            updateQty(item.id, item.qty + 1)
                                        }
                                        className="text-primary bg-background hover:bg-muted "
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                            updateQty(item.id, item.qty - 1)
                                        }
                                        className="text-primary bg-background hover:bg-muted "
                                    >
                                        <MinusIcon className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* RIGHT: DELETE & SAVE FOR LATER BUTTONS */}
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        addToWishlist(item.id);
                                        removeFromCart(item.id);
                                    }}
                                    className="text-primary bg-background hover:bg-muted"
                                    title="Save for Later"
                                >
                                    <Heart size={18} />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className="text-destructive-foreground bg-destructive/90 hover:bg-destructive/80"
                                            title="Remove from Cart"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </AlertDialogTrigger>

                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Remove item?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently remove{" "}
                                            <b>{item.name}</b> from your cart.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>

                                        <AlertDialogAction
                                            className="bg-destructive text-white hover:bg-destructive/80"
                                            onClick={() => handleRemove(item)}
                                        >
                                            Remove
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {cart.length > 0 && (
                    <div className="mt-6 text-right">
                        <h2 className="text-2xl font-bold">Total: ₹{total}</h2>

                        <Button className="mt-4 w-full text-lg py-6 bg-primary hover:bg-primary/90" onClick={proceedOrder}>
                            Proceed to Pay with Stripe
                        </Button>
                    </div>
                )}

                {/* WISHLIST SECTION */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-primary" />
                        Saved for Later
                    </h2>

                    {wishlist.length === 0 ? (
                        <p className="text-muted-foreground text-center flex flex-col items-center justify-center p-6 bg-card border rounded-xl shadow-sm">
                            <Heart className="w-12 h-12 text-muted-foreground/50 mb-2" />
                            No items saved for later.
                        </p>
                    ) : (
                        <div className="space-y-4">
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
                                                <h3 className="font-semibold text-lg text-card-foreground cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                                                    {item.name}
                                                </h3>
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
                                                className="text-primary bg-background hover:bg-muted font-semibold"
                                            >
                                                Move to Cart
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                onClick={() => removeFromWishlist(item.id)}
                                                className="text-destructive-foreground bg-destructive/90 hover:bg-destructive/80"
                                                title="Remove from Wishlist"
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
