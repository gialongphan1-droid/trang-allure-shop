// frontend/src/pages/admin/AdminCategories.jsx
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useDraft } from "@/hooks/useDraft";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryApi } from "../../api/productApi";
import { fetchCategories } from "../../store/slices/categorySlice";

const CATEGORY_DRAFT_KEY = "categoryFormDraft";

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: categories, loading } = useSelector((state) => state.categories);

  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ✅ Sử dụng useDraft để lưu form data
  const [formData, setFormData, clearDraft] = useDraft(CATEGORY_DRAFT_KEY, {
    name: "",
    description: "",
    icon: "",
    isActive: true,
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenDialog = (category = null) => {
    if (category) {
      // Edit mode
      setEditingCategory(category);
      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: category.icon || "",
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    } else {
      // Add mode - giữ draft nếu có
      setEditingCategory(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory._id, formData);
        toast({
          title: "Cập nhật thành công",
          description: "Danh mục đã được cập nhật",
        });
      } else {
        await categoryApi.createCategory(formData);
        toast({
          title: "Thêm thành công",
          description: "Danh mục mới đã được tạo",
        });
      }
      // ✅ Xóa draft sau khi thành công
      clearDraft();
      setIsDialogOpen(false);
      setEditingCategory(null);
      dispatch(fetchCategories());
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await categoryApi.deleteCategory(deleteTarget._id);
      toast({
        title: "Xóa thành công",
        description: "Danh mục đã được xóa",
      });
      setDeleteTarget(null);
      dispatch(fetchCategories());
    } catch (error) {
      toast({
        title: "Lỗi xóa",
        description: error.message || "Không thể xóa danh mục này",
        variant: "destructive",
      });
    }
  };

  // ✅ Xử lý đóng dialog
  const handleDialogClose = () => {
    clearDraft();
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl font-display text-brand-text">
            Quản lý danh mục
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Quản lý danh mục sản phẩm của cửa hàng
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full text-white sm:w-auto bg-brand-primary hover:bg-brand-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-brand-text">
                {editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-brand-text">
                  Tên danh mục <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon" className="text-brand-text">
                  Icon (Emoji)
                </Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="VD: 💄, 🧴, 👁️"
                  className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-brand-text">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 border-border rounded text-brand-primary focus:ring-brand-primary focus:ring-2 transition-all duration-200"
                />
                <Label htmlFor="isActive" className="cursor-pointer text-muted-foreground">
                  Hiển thị danh mục
                </Label>
              </div>
              <div className="sticky bottom-0 flex justify-end gap-3 pt-4 bg-white border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="text-white bg-brand-primary hover:bg-brand-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {editingCategory ? "Cập nhật" : "Thêm mới"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute w-4 h-4 text-muted-foreground -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10 transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
          />
          {search && (
            <button
              onClick={handleClearSearch}
              className="absolute text-muted-foreground -translate-y-1/2 right-3 top-1/2 hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {search && (
          <div className="text-sm text-muted-foreground">
            Kết quả: {filteredCategories.length} danh mục
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-border shadow-sm rounded-xl">
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-16">STT</TableHead>
                <TableHead className="w-16">Icon</TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                    {search ? "Không tìm thấy danh mục nào phù hợp" : "Chưa có danh mục nào"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((cat, index) => (
                  <TableRow key={cat._id} className="hover:bg-brand-primary/5 transition-colors">
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-2xl">{cat.icon || "📦"}</TableCell>
                    <TableCell className="font-medium text-brand-text">{cat.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell className="max-w-xs truncate text-muted-foreground">
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          cat.isActive ? "bg-green-500 hover:bg-green-600" : "bg-destructive hover:bg-destructive/90"
                        }
                      >
                        {cat.isActive ? "Hiển thị" : "Ẩn"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenDialog(cat)}
                          className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteTarget(cat)}
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="p-4 space-y-4 md:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              {search ? "Không tìm thấy danh mục nào phù hợp" : "Chưa có danh mục nào"}
            </p>
          ) : (
            filteredCategories.map((cat) => (
              <div
                key={cat._id}
                className="p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{cat.icon || "📦"}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-brand-text">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.slug}</p>
                    {cat.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{cat.description}</p>
                    )}
                    <Badge
                      className={`mt-1 ${
                        cat.isActive ? "bg-green-500 hover:bg-green-600" : "bg-destructive hover:bg-destructive/90"
                      }`}
                    >
                      {cat.isActive ? "Hiển thị" : "Ẩn"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(cat)}
                      className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(cat)}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-brand-text">
              Xác nhận xóa danh mục
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "
              <span className="font-medium text-foreground">{deleteTarget?.name}</span>"? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminCategories;