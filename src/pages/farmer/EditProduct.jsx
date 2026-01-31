import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { farmerMenu } from "@/constants/menus";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { IKUpload, IKContext } from "imagekitio-react";
import { productApi, imagekitApi } from "@/api/api";
import { toast } from "sonner";

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
  });

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const res = await productApi.get(`/get/${id}`);
      const p = res.data;

      setForm({
        name: p.name,
        description: p.description,
        price: p.price,
        categoryId: p.category.id,
        stockQuantity: p.stockQuantity,
      });

      setImgUrl(p.imgUrl);
      setPreview(p.imgUrl);
    } finally {
      setLoading(false);
    }
  };

  const getImageKitAuth = async () => {
    const res = await imagekitApi.get();
    return res.data;
  };

  const onUploadSuccess = (res) => {
    setImgUrl(res.url);
    setPreview(res.url + "?t=" + Date.now());
  };

  const updateProduct = async () => {
    const body = { ...form, imgUrl };

    await productApi.put(`/update/${id}`, body);

    toast.success("Product updated successfully");
    navigate("/farmer/products");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout title="Edit Product" menuItems={farmerMenu}>
      <IKContext
        publicKey="public_/OtjO2DvwBlabV/qqTQSK5Kl7EE="
        urlEndpoint="https://ik.imagekit.io/Agrisell"
        authenticator={getImageKitAuth}
      >
        <div className="max-w-xl mx-auto p-6 space-y-4">
          <Label>Name</Label>
          <Input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Label>Description</Label>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Label>Price</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <Label>Stock</Label>
          <Input
            type="number"
            value={form.stockQuantity}
            onChange={(e) =>
              setForm({ ...form, stockQuantity: e.target.value })
            }
          />

          <Label>Image</Label>

          <IKUpload
            fileName="product.jpg"
            folder="/products"
            onSuccess={onUploadSuccess}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded mt-3"
            />
          )}

          <Button className="w-full mt-4" onClick={updateProduct}>
            Save Changes
          </Button>
        </div>
      </IKContext>
    </Layout>
  );
}
