import React, { useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import Layout from "@/components/Layout";
import { buyerMenu, farmerMenu, adminMenu } from "@/constants/Menus";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { Upload, User } from "lucide-react";
import { toast } from "sonner";

import { userApi, imagekitApi } from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function EditAccount() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  if (!user) {
    navigate("/login");
    return null;
  }

  const [preview, setPreview] = useState(
    user.profileUrl ? user.profileUrl + "?t=" + Date.now() : ""
  );

  const [loading, setLoading] = useState(false);

  const menu =
    user.role === "ADMIN"
      ? adminMenu
      : user.role === "FARMER"
      ? farmerMenu
      : buyerMenu;

  // ImageKit Authenticator
  const getImageKitAuth = async () => {
    const res = await imagekitApi.get();
    return res.data;
  };

  // Upload Success Handler
  const onImageSuccess = async (res) => {
    setLoading(true);

    try {
      const response = await userApi.put("/user/profile-photo", {
        profileUrl: res.url,
      });

      updateUser(response.data);
      setPreview(res.url + "?t=" + Date.now());

      toast.success("Profile photo updated successfully");
    } catch {
      toast.error("Failed to update profile photo");
    }

    setLoading(false);
  };

  // Personal Info Update
  const handlePersonalUpdate = async () => {
    setLoading(true);

    try {
      const res = await userApi.patch("/user/profile", {
        name: user.name,
        phone: user.phone,
      });

      updateUser(res.data);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    }

    setLoading(false);
  };

  // Address Update
  const handleAddressUpdate = async () => {
    setLoading(true);

    try {
      await userApi.put("/user/address", user.address);
      toast.success("Address updated successfully");
    } catch {
      toast.error("Failed to update address");
    }

    setLoading(false);
  };

  return (
    <Layout title="Edit Account" menuItems={menu}>
      <IKContext
        publicKey="public_/OtjO2DvwBlabV/qqTQSK5Kl7EE="
        urlEndpoint="https://ik.imagekit.io/Agrisell"
        authenticator={getImageKitAuth}
      >
        <div className="max-w-5xl mx-auto p-6 space-y-8">

          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Profile Photo */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border bg-muted flex items-center justify-center mb-3">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} />
                  )}
                </div>

                <IKUpload
                  id="profile-upload"
                  fileName={`user-${user.id}.jpg`}
                  folder="/profiles"
                  useUniqueFileName={false}
                  onSuccess={onImageSuccess}
                  onError={() => toast.error("Upload failed")}
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={() =>
                    document.getElementById("profile-upload").click()
                  }
                >
                  <Upload size={16} className="mr-2" />
                  Choose Photo
                </Button>
              </div>

              {/* User Details */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input
                    value={user.name}
                    onChange={(e) =>
                      updateUser({ ...user, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input
                    value={user.phone || ""}
                    onChange={(e) =>
                      updateUser({ ...user, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>

                <Button onClick={handlePersonalUpdate} disabled={loading}>
                  Save Personal Info
                </Button>
              </div>
            </div>
          </Card>

          {/* Address Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              Address Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["street", "city", "district", "state", "country", "postalCode"].map(
                (field) => (
                  <div key={field} className="space-y-1">
                    <Label className="capitalize">{field}</Label>

                    <Input
                      value={user.address?.[field] || ""}
                      onChange={(e) =>
                        updateUser({
                          ...user,
                          address: {
                            ...user.address,
                            [field]: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                )
              )}
            </div>

            <Button
              className="mt-4"
              onClick={handleAddressUpdate}
              disabled={loading}
            >
              Save Address
            </Button>
          </Card>
        </div>
      </IKContext>
    </Layout>
  );
}
