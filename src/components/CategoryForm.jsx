import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { IKUpload, IKContext } from "imagekitio-react";
import { categoryApi, imagekitApi } from "@/api/api";

export default function CategoryForm({ editData, onSuccess }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Image state
  const [preview, setPreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // Form state (Select values must always be strings)
  const [form, setForm] = useState({
    name: "",
    parentId: "main",
  });

  // Load parent categories
  useEffect(() => {
    categoryApi.get("/main").then((res) => {
      setCategories(res.data);
    });
  }, []);

  // If edit mode, preload values
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,

        // parentId must be string for Select
        parentId: editData.parent?.id
          ? editData.parent.id.toString()
          : "main",
      });

      setPreview(editData.imgUrl);
      setImageUrl(editData.imgUrl);
    }
  }, [editData, categories]);

  // ImageKit authentication using Axios
  const getImageKitAuth = async () => {
    const res = await imagekitApi.get("");
    return res.data;
  };

  // Upload success handler
  const onUploadSuccess = (res) => {
    setImageUrl(res.url);
    setPreview(res.url);
  };

  // Upload error handler
  const onUploadError = () => {
    alert("Image upload failed!");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      name: form.name,
      parentId: form.parentId === "main" ? null : form.parentId,
      imgUrl: imageUrl,
    };

    try {
      if (editData) {
        await categoryApi.put(`/update/${editData.id}`, body);
      } else {
        await categoryApi.post("/add", body);
      }

      onSuccess();
    } catch {
      alert("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>

      {/* Parent category */}
      <div>
        <Label>Parent Category</Label>

        <Select
          value={form.parentId}
          onValueChange={(v) => setForm({ ...form, parentId: v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Parent" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="main">Main Category</SelectItem>

            {categories.map((c) => (
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

      {/* Image upload */}
      <div>
        <Label>Category Image (optional)</Label>

        <IKContext
          publicKey="public_/OtjO2DvwBlabV/qqTQSK5Kl7EE="
          urlEndpoint="https://ik.imagekit.io/Agrisell"
          authenticator={getImageKitAuth}
        >
          <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition">
            <IKUpload
              fileName={`${form.name || "category"}.jpg`}
              folder="/categories"
              onSuccess={onUploadSuccess}
              onError={onUploadError}
            />

            {/* Preview */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-28 h-28 mx-auto mt-3 rounded-lg shadow"
              />
            )}
          </div>
        </IKContext>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading
          ? "Saving..."
          : editData
          ? "Update Category"
          : "Add Category"}
      </Button>
    </form>
  );
}
