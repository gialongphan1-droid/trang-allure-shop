/* eslint-disable react-hooks/set-state-in-effect */
import { productApi } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useDraft } from "@/hooks/useDraft";
import { optimizeAdmin } from "@/utils/imageUtils";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";

const ImageUpload = lazy(() => import("@/components/common/ImageUpload"));

const ImageUploadLoader = () => (
  <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg border-border">
    <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
  </div>
);

const PRODUCT_DRAFT_KEY = "productFormDraft";

// ✅ Helper: chuyển dataURL thành File
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// ============================
// IMAGE UPLOAD SECTION
// ============================
const ImageUploadSection = ({ value, onChange, onRemove, onClear }) => {
  const [previews, setPreviews] = useState(value || []);

  useEffect(() => {
    if (value && value.length > 0) {
      setPreviews(value);
    }
  }, [value]);

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      // ✅ Đọc file thành base64
      const readers = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(readers).then((base64s) => {
        setPreviews((prev) => [...prev, ...base64s]);
        onChange(base64s);
      });
    }
  };

  const handleRemoveImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    if (onRemove) {
      onRemove(index);
    }
  };

  const handleClearAll = () => {
    setPreviews([]);
    if (onClear) {
      onClear();
    }
  };

  const getOptimizedImage = (imageUrl) => {
    return imageUrl ? optimizeAdmin(imageUrl) : "";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Suspense fallback={<ImageUploadLoader />}>
          <ImageUpload
            value={value || []}
            onChange={handleFileChange}
            multiple={true}
            maxFiles={0}
          />
        </Suspense>
        {previews.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex-shrink-0 hover:border-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Xóa tất cả ({previews.length})
          </Button>
        )}
      </div>

      {previews.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-gray-300">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative w-20 h-20 border border-border rounded-lg overflow-hidden group flex-shrink-0"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 p-0.5 bg-destructive rounded-bl-lg hover:bg-destructive/90 transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Đã tải lên {previews.length} ảnh
          </p>
        </>
      )}
    </div>
  );
};

// ============================
// PRODUCT FORM
// ============================
const ProductForm = ({
  product = null,
  categories = [],
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // ✅ File để upload

  const [formData, setFormData, clearDraft] = useDraft(PRODUCT_DRAFT_KEY, {
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    brand: "",
    category: "",
    images: [], // ✅ mảng base64
    isActive: true,
  });

  // ✅ Khi sửa sản phẩm, load từ API, không lưu ảnh cũ vào draft
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        description: product.description || "",
        brand: product.brand || "",
        category: product.category?._id || "",
        images: [], // Không lưu ảnh cũ vì không có base64
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
      setSelectedCategory(product.category?._id || "");
      setImageFiles([]);
    }
  }, [product, setFormData, setSelectedCategory]);

  // ✅ Xử lý khi thêm ảnh mới (base64)
  const handleImageUploadChange = (base64s) => {
    if (base64s && base64s.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64s],
      }));
      // ✅ Chuyển base64 thành File để upload sau
      const files = base64s.map((base64, index) =>
        dataURLtoFile(base64, `image-${Date.now()}-${index}.jpg`)
      );
      setImageFiles((prev) => [...prev, ...files]);
    }
  };

  const handleClearImages = () => {
    setImageFiles([]);
    setFormData((prev) => ({ ...prev, images: [] }));
  };

  const handleRemoveImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls = [];

      // ✅ Upload ảnh mới nếu có
      if (imageFiles.length > 0) {
        const formDataImage = new FormData();
        imageFiles.forEach((file) => {
          formDataImage.append("images", file);
        });
        const uploadResponse = await productApi.uploadProductImages(formDataImage);
        if (uploadResponse.success) {
          imageUrls = uploadResponse.data.urls;
        } else {
          throw new Error("Upload ảnh thất bại");
        }
      }

      // ✅ Nếu là edit, giữ ảnh cũ
      if (product && product.images && product.images.length > 0) {
        imageUrls = [...product.images, ...imageUrls];
      }

      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        images: imageUrls,
      };

      let response;
      if (product) {
        response = await productApi.updateProduct(product._id, productData);
      } else {
        response = await productApi.createProduct(productData);
      }

      if (response.success) {
        toast({
          title: "Thành công 🎉",
          description: product ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
        });
        clearDraft();
        setImageFiles([]);
        onSuccess?.();
      } else {
        throw new Error(response.message || "Lỗi khi lưu sản phẩm");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu sản phẩm",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogConfirm = () => {
    if (dialogAction === "delete") {
      console.log("Delete confirmed");
    } else if (dialogAction === "submit") {
      handleSubmit(new Event("submit"));
    }
    setIsDialogOpen(false);
    setDialogAction(null);
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
    setDialogAction(null);
  };

  const openDialog = (action) => {
    setDialogAction(action);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    clearDraft();
    setImageFiles([]);
    onCancel?.();
  };

  const renderDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-brand-text">
            {dialogAction === "delete" ? "Xác nhận xóa" : "Xác nhận"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-muted-foreground">
          <p>
            {dialogAction === "delete"
              ? "Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
              : "Bạn có chắc chắn muốn thực hiện hành động này?"}
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleDialogCancel}
            className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
          >
            Hủy
          </Button>
          <Button
            onClick={handleDialogConfirm}
            className={
              dialogAction === "delete"
                ? "bg-destructive text-white hover:bg-destructive/90"
                : "bg-brand-primary text-white hover:bg-brand-accent"
            }
          >
            {dialogAction === "delete" ? "Xóa" : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const renderIcons = () => (
    <div className="flex items-center gap-2 p-2 border border-border rounded-lg bg-muted/30">
      <Pencil className="w-4 h-4 text-brand-primary" />
      <Plus className="w-4 h-4 text-green-500" />
      <Search className="w-4 h-4 text-purple-500" />
      <Trash2 className="w-4 h-4 text-destructive" />
      <X className="w-4 h-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground ml-1">Các thao tác</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Tên sản phẩm */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-brand-text">
            Tên sản phẩm <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên sản phẩm"
            required
            className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Thương hiệu */}
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-brand-text">
            Thương hiệu
          </Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Nhập tên thương hiệu"
            className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Danh mục */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-brand-text">
            Danh mục <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Search className="absolute w-4 h-4 text-muted-foreground -translate-y-1/2 left-3 top-1/2" />
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value });
                setSelectedCategory(value);
              }}
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5">
                  <Input
                    placeholder="Tìm danh mục..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 text-sm transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
                {categories
                  .filter((cat) => cat.name.toLowerCase().includes(search.toLowerCase()))
                  .map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCategory && (
            <p className="text-xs text-green-600">
              ✓ Đã chọn: {categories.find((c) => c._id === selectedCategory)?.name}
            </p>
          )}
        </div>

        {/* Giá */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-brand-text">
              Giá bán <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0"
              required
              min="0"
              className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice" className="text-brand-text">
              Giá gốc
            </Label>
            <Input
              id="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="0"
              min="0"
              className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-brand-text">
            Mô tả
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả chi tiết sản phẩm..."
            rows={4}
            className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        {/* Upload ảnh */}
        <ImageUploadSection
          value={formData.images}
          onChange={handleImageUploadChange}
          onRemove={handleRemoveImage}
          onClear={handleClearImages}
        />

        {/* Active */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 border-border rounded text-brand-primary focus:ring-brand-primary focus:ring-2 transition-all duration-200"
          />
          <Label htmlFor="isActive" className="cursor-pointer text-muted-foreground">
            Hiển thị sản phẩm
          </Label>
        </div>

        {renderIcons()}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="text-white bg-brand-primary hover:bg-brand-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang xử lý...
            </span>
          ) : product ? (
            "Cập nhật"
          ) : (
            "Thêm mới"
          )}
        </Button>
        {product && (
          <Button
            type="button"
            variant="destructive"
            onClick={() => openDialog("delete")}
            className="hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Xóa
          </Button>
        )}
      </div>

      {renderDialog()}
    </form>
  );
};

export default ProductForm;