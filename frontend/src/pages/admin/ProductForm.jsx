import ImageUpload from "@/components/common/ImageUpload";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useEffect, useState } from "react";
import { productApi } from "../../api/productApi";
import slugify from "slugify";

const ProductForm = ({
  product = null,
  categories = [],
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    images: [],
    isActive: true,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        originalPrice: product.originalPrice || "",
        category: product.category?._id || "",
        brand: product.brand || "",
        images: product.images || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
      });
    }
  }, [product]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name.trim(),
        slug: slugify(formData.name.trim(), { lower: true, strict: true, locale: "vi" }),
        description: formData.description.trim(),
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        brand: formData.brand?.trim() || "",
        images: formData.images.filter((img) => img && img.trim() !== ""),
        stock: 0,
        isActive: formData.isActive,
      };

      if (!data.price || data.price <= 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập giá bán hợp lệ",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!data.name) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập tên sản phẩm",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!data.description) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập mô tả sản phẩm",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!data.category) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn danh mục sản phẩm",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (data.images.length === 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng upload ít nhất 1 ảnh",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (product) {
        await productApi.updateProduct(product._id, data);
        toast({
          title: "Cập nhật thành công",
          description: "Sản phẩm đã được cập nhật",
        });
      } else {
        await productApi.createProduct(data);
        toast({
          title: "Thêm sản phẩm thành công",
          description: "Sản phẩm mới đã được tạo",
        });
      }
      onSuccess();
    } catch (error) {
      console.error("❌ Lỗi chi tiết:", error);
      toast({
        title: "Lỗi",
        description: error?.message || "Có lỗi xảy ra, vui lòng thử lại",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tên sản phẩm */}
      <div className="space-y-2">
        <Label htmlFor="name" className="dark:text-gray-300">Tên sản phẩm *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Mô tả */}
      <div className="space-y-2">
        <Label htmlFor="description" className="dark:text-gray-300">Mô tả *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
          required
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Giá */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price" className="dark:text-gray-300">Giá bán (VNĐ) *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", e.target.value)}
            required
            min="0"
            placeholder="Nhập giá bán"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="originalPrice" className="dark:text-gray-300">Giá gốc (VNĐ)</Label>
          <Input
            id="originalPrice"
            type="number"
            value={formData.originalPrice}
            onChange={(e) => handleChange("originalPrice", e.target.value)}
            min="0"
            placeholder="Để trống nếu không có"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Danh mục & Thương hiệu */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="dark:text-gray-300">Danh mục *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
          >
            <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              {categories.map((cat) => (
                <SelectItem key={cat._id} value={cat._id} className="dark:text-white">
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand" className="dark:text-gray-300">Thương hiệu</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
            placeholder="VD: MAC, 3CE, Maybelline..."
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
      </div>

      {/* Upload ảnh */}
      <div className="space-y-2">
        <Label className="dark:text-gray-300">Hình ảnh sản phẩm *</Label>
        <ImageUpload
          value={formData.images}
          onChange={(images) => handleChange("images", images)}
          multiple={true}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
          💡 Kéo thả hoặc click để chọn ảnh - Không giới hạn số lượng và dung lượng
        </p>
      </div>

      {/* Trạng thái */}
      <div className="flex items-center pt-2 space-x-2">
        <Checkbox
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => handleChange("isActive", checked)}
          className="dark:border-gray-600"
        />
        <Label htmlFor="isActive" className="cursor-pointer dark:text-gray-300">
          Hiển thị sản phẩm
        </Label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel} className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
          Hủy
        </Button>
        <Button
          type="submit"
          className="text-white bg-brand-primary hover:bg-brand-accent"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : product ? "Cập nhật" : "Thêm mới"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;