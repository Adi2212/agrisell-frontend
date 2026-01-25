import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "@/components/Layout";
import { farmerMenu } from "@/constants/menus";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { IKUpload, IKContext } from "imagekitio-react";
import { Upload } from "lucide-react";

import { categoryApi, productApi, imagekitApi } from "@/api/api";

export default function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  // Category states
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedMain, setSelectedMain] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stockQuantity: "",
  });

  // Load main categories
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const res = await categoryApi.get("/main");
        setMainCategories(res.data);
      } catch {
        alert("Failed to load categories");
      }
    };

    fetchMainCategories();
  }, []);

  // Load subcategories when main selected
  const handleMainChange = async (value) => {
    setSelectedMain(value);
    setForm({ ...form, category: "" });

    try {
      const res = await categoryApi.get(`/sub/${value}`);
      setSubCategories(res.data);
    } catch {
      alert("Failed to load subcategories");
    }
  };

  // Form change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ImageKit authenticator
  const getImageKitAuth = async () => {
    const res = await imagekitApi.get();
    return res.data;
  };

  // Image Upload success
  const onUploadSuccess = (res) => {
    setImgUrl(res.url);
    setPreview(res.url);
  };

  const onUploadError = () => {
    alert("Image upload failed");
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category || !imgUrl) {
      alert("Please fill all required fields and upload image");
      return;
    }

    try {
      setLoading(true);

      const body = {
        name: form.name,
        description: form.description,
        categoryId: Number(form.category),
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity || "0"),
        imgUrl: imgUrl,
      };

      await productApi.post("/add", body);

      alert("Product Added Successfully");
      navigate("/farmer/products");
    } catch {
      alert("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Add Product" menuItems={farmerMenu}>
      <IKContext
        publicKey="public_/OtjO2DvwBlabV/qqTQSK5Kl7EE="
        urlEndpoint="https://ik.imagekit.io/Agrisell"
        authenticator={getImageKitAuth}
      >
        <div className="flex justify-center p-4 w-full">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl space-y-6 p-6 rounded-md shadow border bg-card"
          >
            {/* Product Name */}
            <div className="space-y-1">
              <Label>Product Name *</Label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label>Description</Label>
              <Textarea
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Main + Sub Category */}
            <div className="grid grid-cols-2 gap-4" >
              {/* Main */}
              <div className="space-y-1">
                <Label>Main Category *</Label>
                <Select value={selectedMain} onValueChange={handleMainChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Main Category" />
                  </SelectTrigger>

                  <SelectContent>
                    {mainCategories.map((c) => (
                      <SelectItem
                        key={c.id.toString()}
                        value={c.id.toString()}
                      >
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub */}
              <div className="space-y-1">
                <Label>Subcategory *</Label>
                <Select
                  disabled={!selectedMain}
                  value={form.category}
                  onValueChange={(value) =>
                    setForm({ ...form, category: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subcategory" />
                  </SelectTrigger>

                  <SelectContent>
                    {subCategories.map((sub) => (
                      <SelectItem
                        key={sub.id.toString()}
                        value={sub.id.toString()}
                      >
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <Label>Price (₹) *</Label>
              <Input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <Label>Stock Quantity</Label>
              <Input
                name="stockQuantity"
                type="number"
                value={form.stockQuantity}
                onChange={handleChange}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-1">
              <Label>Product Image *</Label>

              <Card className="border-dashed border-2 rounded-xl p-6">
                <div className="flex flex-col items-center justify-center gap-4 text-center">

                  {/* Icon */}
                  <Upload className="w-10 h-10 text-muted-foreground" />

                  {/* Custom Upload Button */}
                  <label className="cursor-pointer px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition">
                    Choose Image

                    <IKUpload
                      fileName="product.jpg"
                      folder="/products"
                      onSuccess={onUploadSuccess}
                      onError={onUploadError}
                      className="hidden"
                    />
                  </label>

                  <p className="text-sm text-muted-foreground">
                    Click to upload product image
                  </p>

                  {/* Preview */}
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 rounded-md object-cover mt-2 shadow"
                    />
                  )}
                </div>
              </Card>
            </div>


            {/* Submit */}
            <Button className="w-full" disabled={loading}>
              {loading ? "Saving..." : "Add Product"}
            </Button>
          </form>
        </div>
      </IKContext>
    </Layout>
  );
}
