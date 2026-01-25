import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/menus";

import { categoryApi, productApi } from "@/api/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProductCard from "@/components/ProductCard";

export default function Categories() {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [selectedMain, setSelectedMain] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Main Categories
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoading(true);
        const res = await categoryApi.get("/main");
        setMainCategories(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchMainCategories();
  }, []);

  // Load Sub Categories when Main clicked
  const handleMainClick = async (cat) => {
    try {
      setSelectedMain(cat);
      setSelectedSub(null);
      setProducts([]);

      setLoading(true);
      const res = await categoryApi.get(`/sub/${cat.id}`);
      setSubCategories(res.data);
    } catch {
      setError("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  // Load Products when SubCategory clicked
  const handleSubClick = async (sub) => {
    try {
      setSelectedSub(sub);
      setLoading(true);
      setError("");

      
      const res = await productApi.get(`/get/category/${sub.id}`);

      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Categories" menuItems={buyerMenu}>
      <main className="p-6 max-w-6xl mx-auto space-y-10">

        {/* Error */}
        {error && (
          <div className="text-center text-red-600 font-medium">
            {error}
          </div>
        )}

        {/* Main Categories */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Main Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {mainCategories.map((cat) => (
              <Card
                key={cat.id}
                onClick={() => handleMainClick(cat)}
                className={`cursor-pointer transition hover:shadow-lg hover:border-primary
                  ${
                    selectedMain?.id === cat.id
                      ? "border-primary shadow-md"
                      : ""
                  }`}
              >
                <CardHeader className="flex flex-col items-center">
                  {cat.imgUrl ? (
                    <img
                      src={cat.imgUrl}
                      alt={cat.name}
                      className="h-16 w-16 object-contain"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-secondary rounded-full" />
                  )}

                  <CardTitle className="mt-2 text-base">
                    {cat.name}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Sub Categories */}
        {selectedMain && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {selectedMain.name} Sub Categories
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {subCategories.map((sub) => (
                <Card
                  key={sub.id}
                  onClick={() => handleSubClick(sub)}
                  className={`cursor-pointer transition hover:shadow-md
                    ${
                      selectedSub?.id === sub.id
                        ? "border-primary shadow-md"
                        : ""
                    }`}
                >
                  <CardContent className="p-6 flex flex-col items-center gap-2 font-medium">
                    {sub.imgUrl ? (
                      <img
                        src={sub.imgUrl}
                        alt={sub.name}
                        className="h-12 w-12 object-contain"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded-full" />
                    )}

                    {sub.name}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        {selectedSub && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              Products in {selectedSub.name}
            </h2>

            {loading ? (
              <p className="text-muted-foreground">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-muted-foreground">
                No products available in this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </Layout>
  );
}
