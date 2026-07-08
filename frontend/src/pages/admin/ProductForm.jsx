import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { lazy, Suspense, useEffect, useState } from "react";
import { productApi } from "../../api/productApi";

// ✅ Lazy load ImageUpload (chỉ tải khi mở form)
const ImageUpload = lazy(() => import("@/components/common/ImageUpload"));

// ✅ Loading fallback cho ImageUpload
const ImageUploadLoader = () => (
	<div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg border-gray-300
		<div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
	</div>
);

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
		slug: "",
		description: "",
		price: "",
		originalPrice: "",
		category: "",
		brand: "",
		stock: 0,
		images: [],
		isActive: true,
	});

	useEffect(() => {
		if (product) {
			setFormData({
				name: product.name || "",
				slug: product.slug || "",
				description: product.description || "",
				price: product.price || "",
				originalPrice: product.originalPrice || "",
				category: product.category?._id || "",
				brand: product.brand || "",
				stock: product.stock || 0,
				images: product.images || [],
				isActive: product.isActive !== undefined ? product.isActive : true,
			});
		}
	}, [product]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const data = {
				...formData,
				price: Number(formData.price),
				originalPrice: Number(formData.originalPrice) || undefined,
				stock: Number(formData.stock),
			};

			if (product) {
				await productApi.updateProduct(product._id, data);
				toast({
					title: "Cập nhật thành công",
					description: "Sản phẩm đã được cập nhật",
				});
			} else {
				await productApi.createProduct(data);
				toast({
					title: "Thêm thành công",
					description: "Sản phẩm mới đã được tạo",
				});
			}
			onSuccess();
		} catch (error) {
			toast({
				title: "Lỗi",
				description: error.message || "Có lỗi xảy ra",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const removeImage = (index) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Name */}
			<div className="space-y-2">
				<Label htmlFor="name" className="">
					Tên sản phẩm *
				</Label>
				<Input
					id="name"
					value={formData.name}
					onChange={(e) => setFormData({ ...formData, name: e.target.value })}
					required
					className=""
				/>
			</div>

			{/* Slug */}
			<div className="space-y-2">
				<Label htmlFor="slug" className="">
					Đường dẫn (Slug)
				</Label>
				<Input
					id="slug"
					value={formData.slug}
					onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
					placeholder="ten-san-pham"
					className=""
				/>
				<p className="text-xs text-gray-500
					Để trống để tự động tạo từ tên sản phẩm
				</p>
			</div>

			{/* Description */}
			<div className="space-y-2">
				<Label htmlFor="description" className="">
					Mô tả
				</Label>
				<Textarea
					id="description"
					value={formData.description}
					onChange={(e) =>
						setFormData({ ...formData, description: e.target.value })
					}
					rows={4}
					className=""
				/>
			</div>

			{/* Price */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="price" className="">
						Giá bán *
					</Label>
					<Input
						id="price"
						type="number"
						value={formData.price}
						onChange={(e) =>
							setFormData({ ...formData, price: e.target.value })
						}
						required
						min="0"
						className=""
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="originalPrice" className="">
						Giá gốc
					</Label>
					<Input
						id="originalPrice"
						type="number"
						value={formData.originalPrice}
						onChange={(e) =>
							setFormData({ ...formData, originalPrice: e.target.value })
						}
						min="0"
						className=""
					/>
				</div>
			</div>

			{/* Category & Brand */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="category" className="">
						Danh mục *
					</Label>
					<Select
						value={formData.category}
						onValueChange={(value) =>
							setFormData({ ...formData, category: value })
						}
					>
						<SelectTrigger className="">
							<SelectValue placeholder="Chọn danh mục" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((cat) => (
								<SelectItem key={cat._id} value={cat._id}>
									{cat.icon} {cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="brand" className="">
						Thương hiệu
					</Label>
					<Input
						id="brand"
						value={formData.brand}
						onChange={(e) =>
							setFormData({ ...formData, brand: e.target.value })
						}
						className=""
					/>
				</div>
			</div>

			{/* Stock */}
			<div className="space-y-2">
				<Label htmlFor="stock" className="">
					Số lượng tồn kho
				</Label>
				<Input
					id="stock"
					type="number"
					value={formData.stock}
					onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
					min="0"
					className=""
				/>
			</div>

			{/* Images */}
			<div className="space-y-2">
				<Label className="ảnh sản phẩm</Label>
				{/* ✅ Lazy load ImageUpload - chỉ tải khi mở form */}
				<Suspense fallback={<ImageUploadLoader />}>
					<ImageUpload
						value={formData.images}
						onChange={(images) => setFormData({ ...formData, images })}
						multiple={true}
					/>
				</Suspense>
			</div>

			{/* Active */}
			<div className="flex items-center space-x-2">
				<Switch
					id="isActive"
					checked={formData.isActive}
					onCheckedChange={(checked) =>
						setFormData({ ...formData, isActive: checked })
					}
				/>
				<Label htmlFor="isActive" className="cursor-pointer
					{formData.isActive ? "Hiển thị" : "Ẩn"}
				</Label>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-3 pt-4 border-t
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className=""
				>
					Hủy
				</Button>
				<Button
					type="submit"
					disabled={loading}
					className="text-white bg-brand-primary hover:bg-brand-accent"
				>
					{loading ? "Đang lưu..." : product ? "Cập nhật" : "Thêm mới"}
				</Button>
			</div>
		</form>
	);
};

export default ProductForm;
