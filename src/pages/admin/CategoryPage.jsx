import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { adminMenu } from "@/constants/Menus";
import { categoryApi } from "@/api/api";

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

import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

import CategoryForm from "@/components/CategoryForm";
import { toast } from "sonner";

export default function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  // status state
  const [deleteCat, setDeleteCat] = useState(null);

  const token = sessionStorage.getItem("token");

  // LOAD CATEGORIES
  const loadCategories = async () => {
    const res = await categoryApi.get("/", {
    });
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  //CHANGE STATUS HANDLER (Soft Delete)
  const changeStatus = async (id, newStatus) => {
    try {
      await categoryApi.put(`/status/${id}/${newStatus}`, {}, {
      });

      loadCategories();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <Layout
      title="Categories"
      menuItems={adminMenu}
      onLogout={() => {
        sessionStorage.clear();
        navigate("/");
      }}
    >
      <div className="p-6 bg-background min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">All Categories</h2>

          <Button
            onClick={() => {
              setEditCategory(null);
              setOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>

        {/* TABLE */}
        <div className="rounded-xl border bg-card shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  {/* NAME */}
                  <TableCell className="font-medium">{cat.name}</TableCell>

                  {/* PARENT */}
                  <TableCell>
                    {cat.parent?.name || "Main Category"}
                  </TableCell>

                  {/*STATUS */}
                  <TableCell>
                    {cat.active ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle size={16} /> Active
                      </span>
                    ) : (
                      <span className="text-red-500 font-semibold flex items-center gap-1">
                        <XCircle size={16} /> Inactive
                      </span>
                    )}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right space-x-2">
                    {/* EDIT */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditCategory(cat);
                        setOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>

                    {/*TOGGLE STATUS */}
                    {cat.active ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteCat(cat)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => changeStatus(cat.id, true)}
                      >
                        Activate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* ADD / EDIT MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
            </DialogHeader>

            <CategoryForm
              editData={editCategory}
              onSuccess={() => {
                setOpen(false);
                loadCategories();
              }}
            />
          </DialogContent>
        </Dialog>

        {/*DEACTIVATE CONFIRMATION */}
        <AlertDialog
          open={!!deleteCat}
          onOpenChange={() => setDeleteCat(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Deactivate category?
              </AlertDialogTitle>

              <AlertDialogDescription>
                This category will be marked as inactive.
                Products cannot be added under it.
                <br />
                <b>{deleteCat?.name}</b>
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction
                onClick={() => {
                  changeStatus(deleteCat.id, false);
                  setDeleteCat(null);
                }}
                className="bg-destructive text-destructive-foreground"
              >
                Deactivate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}
