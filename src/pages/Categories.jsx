import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { buyerMenu } from "@/constants/menus";
import { categoryApi } from "@/api/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Categories() {
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load MAIN categories
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

  // Load SUB categories
  const handleCategoryClick = async (category) => {
    try {
      setSelectedCategory(category);
      setLoading(true);
      setError("");

      const res = await categoryApi.get(`/sub/${category.id}`);
      setSubCategories(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load sub categories");
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

        {/* MAIN CATEGORIES */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Main Categories
          </h2>

          {loading && mainCategories.length === 0 ? (
            <p className="text-muted-foreground">Loading categories...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {mainCategories.map((cat) => (
                <Card
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`cursor-pointer transition
                    hover:shadow-lg hover:border-primary
                    ${
                      selectedCategory?.id === cat.id
                        ? "border-primary shadow-md"
                        : ""
                    }`}
                >
                  <CardHeader className="flex flex-col items-center">
                    {/* Show category image */}
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
          )}
        </section>

        {/* SUB CATEGORIES */}
        {selectedCategory && (
          <section>
            <h2 className="text-xl font-semibold mb-4">
              {selectedCategory.name} Sub Categories
            </h2>

            {loading ? (
              <p className="text-muted-foreground">
                Loading sub categories...
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {subCategories.map((sub) => (
                  <Card
                    key={sub.id}
                    className="cursor-pointer hover:bg-secondary/10 transition"
                  >
                    <CardContent className="p-6 flex flex-col items-center gap-2 font-medium">

                      {/* Show subcategory image */}
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
            )}
          </section>
        )}
      </main>
    </Layout>
  );
}
