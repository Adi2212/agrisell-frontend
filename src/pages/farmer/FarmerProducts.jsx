import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { farmerMenu } from "@/constants/Menus";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Package, Pencil, Trash2, PlusCircle } from "lucide-react";
import { productApi } from "@/api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function FarmerProducts() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await productApi.get("/farmer");
      setProducts(res.data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      setDeleting(true);

      await productApi.delete(`/delete/${selectedProduct.id}`);

      setProducts((prev) =>
        prev.filter((p) => p.id !== selectedProduct.id)
      );

      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Layout title="My Products" menuItems={farmerMenu}>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary">
            Products
          </h2>

          <Button onClick={() => navigate("/farmer/products/add")}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Product
          </Button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Package className="mx-auto h-14 w-14" />
            <p>No products found.</p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <Card key={product.id} className="shadow border rounded-xl">
              <img
                src={product.imgUrl}
                alt={product.name}
                className="w-full h-44 object-contain rounded-t-xl"
              />

              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {product.category?.name}
                </p>
              </CardHeader>

              <CardContent>
                <p className="font-bold text-lg">
                  ₹{product.price}
                </p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stockQuantity}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(`/farmer/products/edit/${product.id}`)
                  }
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDeleteModal(true);
                  }}
                >
                  <Trash2 size={16} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-background p-6 rounded-lg w-80">
            <h3 className="font-semibold text-lg text-red-600">
              Delete Product?
            </h3>
            <p className="text-sm mt-2">
              Are you sure you want to delete{" "}
              <b>{selectedProduct?.name}</b>?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
