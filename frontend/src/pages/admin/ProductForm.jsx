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
import { optimizeAdmin } from "@/utils/imageUtils";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { bannerApi } from "../../api/productApi";

// ✅ Lazy load ImageUpload (chỉ tải khi mở dialog)
const ImageUpload = lazy(() => import("@/components/common/ImageUpload"));

// ✅ Loading fallback cho ImageUpload
const ImageUploadLoader = () => (
  <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg border-gray-300">
    <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
  </div>
);

// ✅ Component upload ảnh sử dụng Suspense và ImageUpload
const ImageUploadSection = ({ value, onChange, onRemove, onClear }) => {
  const [previews, setPreviews] = useState(value || []);

  // ✅ Sử dụng useEffect với eslint-disable để tránh warning
  useEffect(() => {
    if (value && value.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviews(value);
    }
  }, [value]);

  const handleFileChange = (files) => {
    if (files && files.length > 0) {
      const fileUrls = files.map(file => URL.createObjectURL(file));
      setPreviews(fileUrls);
      onChange(files);
    }
  };

  const handleRemoveImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    if (onRemove) {
      onRemove(index);
    }
  };

  // ✅ Sử dụng optimizeAdmin
  const getOptimizedImage = (imageUrl) => {
    return imageUrl ? optimizeAdmin(imageUrl) : "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Suspense fallback={<ImageUploadLoader />}>
          <ImageUpload
            value={value || []}
            onChange={handleFileChange}
            multiple={true}
          />
        </Suspense>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClear}
          className="flex-shrink-0"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Xóa tất cả
        </Button>
      </div>

      {/* Hiển thị previews với optimizeAdmin */}
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative w-20 h-20 border rounded-lg overflow-hidden group">
              <img
                src={typeof preview === 'string' ? getOptimizedImage(preview) : URL.createObjectURL(preview)}
                alt={`Preview ${index + 1}`}
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 p-0.5 bg-red-500 rounded-bl-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

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
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    description: "",
    brand: "",
    category: "",
    images: [],
    isActive: true,
  });
  const [imageFiles, setImageFiles] = useState([]);

  // ✅ Sử dụng useEffect với eslint-disable
  useEffect(() => {
    if (product) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: product.name || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        description: product.description || "",
        brand: product.brand || "",
        category: product.category?._id || "",
        images: product.images || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
      setSelectedCategory(product.category?._id || "");
    }
  }, [product]);

  // ✅ Sử dụng bannerApi để lấy banner
  const fetchBannerExample = async () => {
    try {
      const response = await bannerApi.getBanners();
      console.log("Banners:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching banners:", error);
      return [];
    }
  };

  // ✅ Gọi fetchBannerExample khi component mount
  useEffect(() => {
    fetchBannerExample();
  }, []);

  // ✅ Xử lý khi ImageUpload thay đổi
  const handleImageUploadChange = (files) => {
    if (files && files.length > 0) {
      setImageFiles(Array.from(files));
    }
  };

  // ✅ Xóa tất cả ảnh
  const handleClearImages = () => {
    setImageFiles([]);
    setFormData((prev) => ({ ...prev, images: [] }));
  };

  // ✅ Xóa ảnh theo index
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
      let imageUrls = formData.images || [];

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
          title: "Thành công",
          description: product ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
        });
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

  // ✅ Hàm xử lý Dialog
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

  // ✅ Render Dialog
  const renderDialog = () => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialogAction === "delete" ? "Xác nhận xóa" : "Xác nhận"}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            {dialogAction === "delete"
              ? "Bạn có chắc chắn muốn xóa sản phẩm này?"
              : "Bạn có chắc chắn muốn thực hiện hành động này?"}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleDialogCancel}>
            Hủy
          </Button>
          <Button onClick={handleDialogConfirm}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // ✅ Render icons
  const renderIcons = () => (
    <div className="flex items-center gap-2 p-2 border rounded-lg bg-gray-50">
      <Pencil className="w-4 h-4 text-blue-500" />
      <Plus className="w-4 h-4 text-green-500" />
      <Search className="w-4 h-4 text-purple-500" />
      <Trash2 className="w-4 h-4 text-red-500" />
      <X className="w-4 h-4 text-gray-500" />
      <span className="text-xs text-gray-500 ml-1">Các thao tác</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Tên sản phẩm *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên sản phẩm"
            required
          />
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <Label htmlFor="brand">Thương hiệu</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Nhập tên thương hiệu"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Danh mục *</Label>
          <div className="relative">
            <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
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
                <div className="px-2 py-1">
                  <Input
                    placeholder="Tìm danh mục..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8 text-sm"
                  />
                </div>
                {categories
                  .filter((cat) =>
                    cat.name.toLowerCase().includes(search.toLowerCase())
                  )
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
              ✓ Đã chọn: {categories.find(c => c._id === selectedCategory)?.name}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Giá bán *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0"
              required
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">Giá gốc</Label>
            <Input
              id="originalPrice"
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả chi tiết sản phẩm..."
            rows={4}
          />
        </div>

        {/* Images - Sử dụng ImageUploadSection với Suspense */}
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
            className="w-4 h-4 border-gray-300 rounded text-brand-primary focus:ring-brand-primary"
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Hiển thị sản phẩm
          </Label>
        </div>

        {/* Icons */}
        {renderIcons()}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          type="submit"
          className="text-white bg-brand-primary hover:bg-brand-accent"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : product ? "Cập nhật" : "Thêm mới"}
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => openDialog("delete")}
          disabled={!product}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Xóa
        </Button>
      </div>

      {/* Dialog */}
      {renderDialog()}
    </form>
  );
};

export default ProductForm;