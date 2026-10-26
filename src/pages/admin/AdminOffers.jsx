import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { adminMenu } from "@/constants/Menus";
import { adminApi, productApi, categoryApi, imagekitApi } from "@/api/api";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

import { IKUpload, IKContext } from "imagekitio-react";
import {
  Plus,
  Pencil,
  Trash2,
  Tag,
  Calendar,
  Package,
  Search,
  Upload,
  CheckCircle,
  XCircle,
  Percent,
  Sparkles,
  ExternalLink,
  Layers,
  Filter,
  CheckCheck,
  FolderPlus,
  FolderMinus,
} from "lucide-react";
import { toast } from "sonner";

// Helper to reliably check active status across Jackson boolean naming variations
const getIsActive = (item) => {
  if (!item) return false;
  if (item.isActive !== undefined) return item.isActive;
  if (item.active !== undefined) return item.active;
  return false;
};

export default function AdminOffers() {
  const navigate = useNavigate();

  // Offers state
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ACTIVE, INACTIVE

  // All available products and categories
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Form modal state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [quickCategorySelect, setQuickCategorySelect] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // View products dialog state
  const [viewProductsOffer, setViewProductsOffer] = useState(null);

  // Load all offers
  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/offers");
      setOffers(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load offers");
    } finally {
      setLoading(false);
    }
  };

  // Load all products and categories for offer assignment
  const loadProductsAndCategories = async () => {
    try {
      setProductsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productApi.get("/get"),
        categoryApi.get("/main").catch(() => categoryApi.get("/")),
      ]);
      setAllProducts(prodRes.data || []);
      setCategories(catRes.data || []);
    } catch {
      toast.error("Failed to load products or categories");
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
    loadProductsAndCategories();
  }, []);

  // ImageKit authenticator
  const getImageKitAuth = async () => {
    const res = await imagekitApi.get();
    return res.data;
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    setEditingOfferId(null);
    setTitle("");
    setDescription("");
    setDiscountPercentage("");
    setBannerUrl("");
    setStartDate("");
    setEndDate("");
    setIsActive(true);
    setSelectedProductIds([]);
    setProductSearch("");
    setSelectedCategoryFilter("ALL");
    setQuickCategorySelect("");
    setDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEdit = (offer) => {
    setEditingOfferId(offer.id);
    setTitle(offer.title || "");
    setDescription(offer.description || "");
    setDiscountPercentage(offer.discountPercentage?.toString() || "");
    setBannerUrl(offer.bannerUrl || "");
    setStartDate(offer.startDate || "");
    setEndDate(offer.endDate || "");
    setIsActive(getIsActive(offer));
    setSelectedProductIds(offer.productIds || []);
    setProductSearch("");
    setSelectedCategoryFilter("ALL");
    setQuickCategorySelect("");
    setDialogOpen(true);
  };

  // Toggle active status
  const handleToggleStatus = async (offerId) => {
    try {
      const res = await adminApi.patch(`/offers/${offerId}/status`);
      const newStatus = getIsActive(res.data);
      toast.success(
        newStatus ? "Offer activated (Visible on Carousel)" : "Offer deactivated (Hidden)"
      );
      setOffers((prev) =>
        prev.map((o) =>
          o.id === offerId
            ? { ...o, isActive: newStatus, active: newStatus }
            : o
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to toggle status");
    }
  };

  // Delete offer
  const handleDeleteOffer = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.delete(`/offers/${deleteTarget.id}`);
      toast.success("Offer deleted successfully");
      setDeleteTarget(null);
      loadOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete offer");
    }
  };

  // Save (Create or Update)
  const handleSaveOffer = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Offer title is required");
      return;
    }

    const discount = parseFloat(discountPercentage);
    if (isNaN(discount) || discount <= 0 || discount > 100) {
      toast.error("Discount percentage must be between 0.01% and 100%");
      return;
    }

    if (!bannerUrl.trim()) {
      toast.error("Banner image URL or upload is required");
      return;
    }

    // Supply both isActive and active to ensure 100% Jackson compatibility
    const payload = {
      title: title.trim(),
      description: description.trim(),
      discountPercentage: discount,
      bannerUrl: bannerUrl.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: isActive,
      active: isActive,
      productIds: selectedProductIds,
    };

    try {
      setSaving(true);
      if (editingOfferId) {
        await adminApi.put(`/offers/${editingOfferId}`, payload);
        toast.success("Offer updated successfully");
      } else {
        await adminApi.post("/offers", payload);
        toast.success("Offer created successfully");
      }
      setDialogOpen(false);
      loadOffers();
      loadProductsAndCategories();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save offer"
      );
    } finally {
      setSaving(false);
    }
  };

  // Product toggle in selector
  const handleToggleProduct = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Bulk category selection helper: matches either parent category or direct category
  const matchesCategory = (product, categoryName) => {
    if (!categoryName || categoryName === "ALL") return true;
    const catLower = categoryName.toLowerCase();
    const directName = product.category?.name?.toLowerCase() || "";
    const parentName = product.parentCategory?.name?.toLowerCase() || "";
    return directName === catLower || parentName === catLower;
  };

  // Bulk add all products of a given category (e.g. "Fruits")
  const handleAddAllInCategory = (categoryName) => {
    if (!categoryName || categoryName === "ALL") return;
    const matchingProducts = allProducts.filter((p) =>
      matchesCategory(p, categoryName)
    );
    const matchingIds = matchingProducts.map((p) => p.id);
    if (matchingIds.length === 0) {
      toast.error(`No products found in category "${categoryName}"`);
      return;
    }
    setSelectedProductIds((prev) => Array.from(new Set([...prev, ...matchingIds])));
    toast.success(`Added all ${matchingIds.length} products in "${categoryName}" to offer!`);
  };

  // Bulk remove all products of a given category
  const handleRemoveAllInCategory = (categoryName) => {
    if (!categoryName || categoryName === "ALL") return;
    const matchingProducts = allProducts.filter((p) =>
      matchesCategory(p, categoryName)
    );
    const idSet = new Set(matchingProducts.map((p) => p.id));
    setSelectedProductIds((prev) => prev.filter((id) => !idSet.has(id)));
    toast.success(`Removed all products in "${categoryName}" from offer`);
  };

  // Select all currently filtered products
  const handleSelectAllProducts = (productsToSelect) => {
    const ids = productsToSelect.map((p) => p.id);
    setSelectedProductIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  // Deselect all currently filtered products
  const handleDeselectAllProducts = (productsToDeselect) => {
    const idSet = new Set(productsToDeselect.map((p) => p.id));
    setSelectedProductIds((prev) => prev.filter((id) => !idSet.has(id)));
  };

  // List of unique category names for filtering and bulk selection
  const uniqueCategoryNames = useMemo(() => {
    const set = new Set();
    // From categories API
    categories.forEach((c) => {
      if (c.name) set.add(c.name);
    });
    // From products parent categories
    allProducts.forEach((p) => {
      if (p.parentCategory?.name) set.add(p.parentCategory.name);
      if (p.category?.name) set.add(p.category.name);
    });
    return Array.from(set).sort();
  }, [categories, allProducts]);

  // Filtered offers in main table
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const matchSearch =
        o.title?.toLowerCase().includes(search.toLowerCase()) ||
        o.description?.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      const activeState = getIsActive(o);
      if (statusFilter === "ACTIVE") return activeState;
      if (statusFilter === "INACTIVE") return !activeState;
      return true;
    });
  }, [offers, search, statusFilter]);

  // Filtered products inside the dialog selector (by Search & Category)
  const filteredModalProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Category filter
      if (selectedCategoryFilter !== "ALL") {
        if (!matchesCategory(p, selectedCategoryFilter)) {
          return false;
        }
      }

      // Search keyword filter
      if (productSearch.trim()) {
        const query = productSearch.toLowerCase();
        const nameMatch = p.name?.toLowerCase().includes(query);
        const directCatMatch = p.category?.name?.toLowerCase().includes(query);
        const parentCatMatch = p.parentCategory?.name?.toLowerCase().includes(query);
        if (!nameMatch && !directCatMatch && !parentCatMatch) {
          return false;
        }
      }

      return true;
    });
  }, [allProducts, productSearch, selectedCategoryFilter]);

  // Statistics
  const totalOffers = offers.length;
  const activeOffers = offers.filter((o) => getIsActive(o)).length;
  const totalProductsOnSale = offers
    .filter((o) => getIsActive(o))
    .reduce((sum, o) => sum + (o.productCount || 0), 0);

  return (
    <Layout
      title="Sale Offers"
      menuItems={adminMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
    >
      <div className="p-6 bg-background min-h-screen space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="text-primary h-6 w-6" /> Sale Offers & Promotions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage homepage carousel banners, special discounts, and products on sale.
            </p>
          </div>

          <Button onClick={handleOpenAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Create Offer
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold">
                  Total Offers
                </p>
                <p className="text-2xl font-bold mt-1">{totalOffers}</p>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Tag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold">
                  Active Offers (Homepage)
                </p>
                <p className="text-2xl font-bold mt-1 text-emerald-600">
                  {activeOffers}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-xl">
                <CheckCircle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-muted-foreground font-semibold">
                  Products On Sale
                </p>
                <p className="text-2xl font-bold mt-1 text-primary">
                  {totalProductsOnSale}
                </p>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-xl">
                <Package className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search offers by title or description..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-muted-foreground font-medium">Status:</span>
            <div className="flex border rounded-lg overflow-hidden bg-background">
              {["ALL", "ACTIVE", "INACTIVE"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold transition ${
                    statusFilter === st
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Offers Table */}
        <div className="rounded-xl border bg-card shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-32">Banner</TableHead>
                <TableHead>Offer Details</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Active Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    Loading offers...
                  </TableCell>
                </TableRow>
              ) : filteredOffers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No offers found. Click "Create Offer" to add one!
                  </TableCell>
                </TableRow>
              ) : (
                filteredOffers.map((offer) => {
                  const isOfferActive = getIsActive(offer);

                  return (
                    <TableRow key={offer.id} className="hover:bg-muted/30">
                      {/* Banner Image */}
                      <TableCell>
                        <div className="w-24 h-14 rounded-lg overflow-hidden bg-muted border relative group">
                          <img
                            src={offer.bannerUrl}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/600x300?text=Banner";
                            }}
                          />
                          <a
                            href={offer.bannerUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                            title="Open banner image"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </TableCell>

                      {/* Title & Description */}
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-semibold text-foreground line-clamp-1">
                            {offer.title}
                          </p>
                          {offer.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                              {offer.description}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Discount */}
                      <TableCell>
                        <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs">
                          {offer.discountPercentage}% OFF
                        </Badge>
                      </TableCell>

                      {/* Validity */}
                      <TableCell>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {offer.startDate || offer.endDate ? (
                            <span>
                              {offer.startDate || "Any"} → {offer.endDate || "Ongoing"}
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-medium">Ongoing</span>
                          )}
                        </div>
                      </TableCell>

                      {/* Products Count & View */}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewProductsOffer(offer)}
                          className="text-xs font-semibold gap-1.5 h-8 px-2"
                        >
                          <Package className="h-3.5 w-3.5 text-primary" />
                          <span>{offer.productCount || 0} Products</span>
                        </Button>
                      </TableCell>

                      {/* Active Toggle Switch */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={isOfferActive}
                            onCheckedChange={() => handleToggleStatus(offer.id)}
                          />
                          <span
                            className={`text-xs font-semibold ${
                              isOfferActive ? "text-emerald-600" : "text-muted-foreground"
                            }`}
                          >
                            {isOfferActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => handleOpenEdit(offer)}
                            title="Edit offer"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => setDeleteTarget(offer)}
                            title="Delete offer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* CREATE / EDIT OFFER DIALOG */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-primary" />
                {editingOfferId ? "Edit Sale Offer" : "Create New Sale Offer"}
              </DialogTitle>
            </DialogHeader>

            <IKContext
              publicKey="public_/OtjO2DvwBlabV/qqTQSK5Kl7EE="
              urlEndpoint="https://ik.imagekit.io/Agrisell"
              authenticator={getImageKitAuth}
            >
              <form onSubmit={handleSaveOffer} className="space-y-5 py-2">
                {/* Title */}
                <div className="space-y-1.5">
                  <Label htmlFor="offer-title">Offer Title *</Label>
                  <Input
                    id="offer-title"
                    placeholder="e.g. Mega Monsoon Harvest Sale"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="offer-desc">Description</Label>
                  <Textarea
                    id="offer-desc"
                    placeholder="Brief description for shoppers (e.g. Get up to 25% off on fresh organic fruits and vegetables)"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Discount & Active Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="offer-discount">Discount Percentage (%) *</Label>
                    <div className="relative">
                      <Input
                        id="offer-discount"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="100"
                        placeholder="e.g. 20"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                        required
                      />
                      <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5 flex flex-col justify-end">
                    <Label>Active Status</Label>
                    <div className="flex items-center gap-3 h-10 border rounded-md px-3 bg-muted/20">
                      <Switch
                        checked={isActive}
                        onCheckedChange={setIsActive}
                        id="offer-active"
                      />
                      <Label
                        htmlFor="offer-active"
                        className="cursor-pointer text-xs font-semibold"
                      >
                        {isActive ? (
                          <span className="text-emerald-600">Active (Visible on Carousel)</span>
                        ) : (
                          <span className="text-muted-foreground">Inactive (Hidden)</span>
                        )}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="offer-start">Start Date (Optional)</Label>
                    <Input
                      id="offer-start"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="offer-end">End Date (Optional)</Label>
                    <Input
                      id="offer-end"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Banner Image (URL or Upload) */}
                <div className="space-y-2">
                  <Label>Banner Image *</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste banner image URL or upload below..."
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      required
                    />
                    <label className="cursor-pointer px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium text-xs flex items-center gap-1.5 whitespace-nowrap transition">
                      <Upload className="h-4 w-4" />
                      <span>{isUploadingImage ? "Uploading..." : "Upload"}</span>
                      <IKUpload
                        fileName="banner.jpg"
                        folder="/offers"
                        onUploadStart={() => setIsUploadingImage(true)}
                        onSuccess={(res) => {
                          setIsUploadingImage(false);
                          setBannerUrl(res.url);
                          toast.success("Banner uploaded successfully!");
                        }}
                        onError={() => {
                          setIsUploadingImage(false);
                          toast.error("Failed to upload image to ImageKit");
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Banner Preview */}
                  {bannerUrl && (
                    <div className="mt-2 border rounded-xl overflow-hidden relative bg-muted max-h-48 flex items-center justify-center">
                      <img
                        src={bannerUrl}
                        alt="Banner Preview"
                        className="w-full h-44 object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/900x350?text=Invalid+Image+URL";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded">
                        Banner Preview
                      </div>
                    </div>
                  )}
                </div>

                {/* PRODUCT & CATEGORY ASSOCIATION SECTION */}
                <div className="space-y-4 pt-3 border-t">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <Label className="text-base font-semibold flex items-center gap-2">
                        <Layers className="h-4 w-4 text-primary" /> Apply Offer to Products & Categories
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Easily select individual products or bulk-apply discount to entire categories (e.g. all Fruits).
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => handleSelectAllProducts(filteredModalProducts)}
                      >
                        Select All Filtered
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7 text-muted-foreground"
                        onClick={() => handleDeselectAllProducts(filteredModalProducts)}
                      >
                        Clear Filtered
                      </Button>
                    </div>
                  </div>

                  {/* QUICK BULK CATEGORY SELECTOR */}
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>One-Click Category Sale (e.g. Add all Fruits at once):</span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1">
                        <Select
                          value={quickCategorySelect}
                          onValueChange={setQuickCategorySelect}
                        >
                          <SelectTrigger className="text-xs h-9 bg-background">
                            <SelectValue placeholder="-- Pick a category to apply/remove in bulk --" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueCategoryNames.map((catName) => {
                              const count = allProducts.filter((p) =>
                                matchesCategory(p, catName)
                              ).length;
                              return (
                                <SelectItem key={catName} value={catName}>
                                  {catName} ({count} products)
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={!quickCategorySelect}
                          onClick={() => handleAddAllInCategory(quickCategorySelect)}
                          className="text-xs h-9 gap-1 whitespace-nowrap"
                        >
                          <FolderPlus className="w-3.5 h-3.5" />
                          Add All in Category
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={!quickCategorySelect}
                          onClick={() => handleRemoveAllInCategory(quickCategorySelect)}
                          className="text-xs h-9 gap-1 whitespace-nowrap text-destructive hover:bg-destructive/10"
                        >
                          <FolderMinus className="w-3.5 h-3.5" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* FILTER BY CATEGORY & KEYWORD SEARCH */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Category Filter */}
                    <div className="relative">
                      <Select
                        value={selectedCategoryFilter}
                        onValueChange={setSelectedCategoryFilter}
                      >
                        <SelectTrigger className="text-xs h-9 bg-background">
                          <div className="flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>
                              {selectedCategoryFilter === "ALL"
                                ? "Filter by Category: All Categories"
                                : `Category: ${selectedCategoryFilter}`}
                            </span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ALL">All Categories</SelectItem>
                          {uniqueCategoryNames.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search by Product or Category Name */}
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search product, category, fruit, vegetable..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="pl-8 text-xs h-9"
                      />
                    </div>
                  </div>

                  {/* Active Category Filter Banner (if a category is filtered) */}
                  {selectedCategoryFilter !== "ALL" && (
                    <div className="flex items-center justify-between p-2.5 px-3 bg-secondary/60 rounded-lg text-xs">
                      <span>
                        Showing only <strong>"{selectedCategoryFilter}"</strong> (
                        {filteredModalProducts.length} items)
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddAllInCategory(selectedCategoryFilter)}
                          className="text-primary hover:underline font-semibold"
                        >
                          + Select All in {selectedCategoryFilter}
                        </button>
                        <span className="text-muted-foreground">|</span>
                        <button
                          type="button"
                          onClick={() => setSelectedCategoryFilter("ALL")}
                          className="text-muted-foreground hover:underline"
                        >
                          Reset Filter
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Selected count and stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                    <span>
                      Selected:{" "}
                      <strong className="text-primary font-bold">
                        {selectedProductIds.length}
                      </strong>{" "}
                      product(s) for this offer
                    </span>
                    <span>
                      Showing {filteredModalProducts.length} of {allProducts.length}
                    </span>
                  </div>

                  {/* Scrollable Products List */}
                  <div className="border rounded-xl divide-y max-h-64 overflow-y-auto bg-card">
                    {productsLoading ? (
                      <p className="text-center p-6 text-xs text-muted-foreground">
                        Loading products and categories...
                      </p>
                    ) : filteredModalProducts.length === 0 ? (
                      <p className="text-center p-6 text-xs text-muted-foreground">
                        No products match your category or search filter.
                      </p>
                    ) : (
                      filteredModalProducts.map((p) => {
                        const isChecked = selectedProductIds.includes(p.id);
                        const discountVal = parseFloat(discountPercentage) || 0;
                        const previewPrice =
                          discountVal > 0
                            ? (p.price * (1 - discountVal / 100)).toFixed(2)
                            : p.price;

                        const categoryLabel = p.parentCategory?.name && p.category?.name && p.parentCategory.name !== p.category.name
                          ? `${p.parentCategory.name} > ${p.category.name}`
                          : p.category?.name || p.parentCategory?.name || "General";

                        return (
                          <div
                            key={p.id}
                            onClick={() => handleToggleProduct(p.id)}
                            className={`flex items-center justify-between p-2.5 px-3 cursor-pointer transition select-none ${
                              isChecked
                                ? "bg-primary/5 hover:bg-primary/10"
                                : "hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={() => handleToggleProduct(p.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <img
                                src={p.imgUrl}
                                alt={p.name}
                                className="w-10 h-10 object-contain rounded border bg-muted"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://placehold.co/100?text=Product";
                                }}
                              />
                              <div>
                                <p className="text-xs font-semibold text-foreground">
                                  {p.name}
                                </p>
                                <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-medium inline-block mt-0.5">
                                  {categoryLabel}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              {discountVal > 0 && isChecked ? (
                                <div>
                                  <span className="text-xs font-bold text-emerald-600">
                                    ₹{previewPrice}
                                  </span>
                                  <span className="text-[11px] line-through text-muted-foreground ml-1.5">
                                    ₹{p.price}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs font-semibold text-foreground">
                                  ₹{p.price}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <DialogFooter className="gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving
                      ? "Saving..."
                      : editingOfferId
                      ? "Update Offer"
                      : "Create Offer"}
                  </Button>
                </DialogFooter>
              </form>
            </IKContext>
          </DialogContent>
        </Dialog>

        {/* VIEW ASSOCIATED PRODUCTS MODAL */}
        <Dialog
          open={!!viewProductsOffer}
          onOpenChange={(open) => !open && setViewProductsOffer(null)}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Products for "{viewProductsOffer?.title}"
              </DialogTitle>
            </DialogHeader>

            <div className="py-2">
              <div className="flex items-center justify-between mb-3 text-sm">
                <span className="text-muted-foreground">
                  Discount:{" "}
                  <strong className="text-red-500 font-bold">
                    {viewProductsOffer?.discountPercentage}% OFF
                  </strong>
                </span>
                <span className="text-muted-foreground">
                  Total Products:{" "}
                  <strong className="text-foreground">
                    {viewProductsOffer?.products?.length || 0}
                  </strong>
                </span>
              </div>

              <div className="border rounded-xl divide-y max-h-80 overflow-y-auto">
                {!viewProductsOffer?.products ||
                viewProductsOffer.products.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No products currently assigned to this offer. Click Edit to attach products.
                  </div>
                ) : (
                  viewProductsOffer.products.map((p) => {
                    const discount = viewProductsOffer.discountPercentage || 0;
                    const discounted = (p.price * (1 - discount / 100)).toFixed(2);
                    const categoryLabel = p.parentCategoryName && p.categoryName && p.parentCategoryName !== p.categoryName
                      ? `${p.parentCategoryName} > ${p.categoryName}`
                      : p.categoryName || p.parentCategoryName || "General";

                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imgUrl}
                            alt={p.name}
                            className="w-11 h-11 object-contain rounded border bg-muted"
                          />
                          <div>
                            <p className="text-sm font-semibold">{p.name}</p>
                            <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                              {categoryLabel}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">
                            ₹{discounted}
                          </p>
                          <p className="text-xs line-through text-muted-foreground">
                            ₹{p.price}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setViewProductsOffer(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  const target = viewProductsOffer;
                  setViewProductsOffer(null);
                  handleOpenEdit(target);
                }}
              >
                Edit Products
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION ALERT DIALOG */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this offer?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the offer "{deleteTarget?.title}" ({deleteTarget?.discountPercentage}% OFF).
                Associated products will revert to their regular price.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteOffer}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete Offer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
