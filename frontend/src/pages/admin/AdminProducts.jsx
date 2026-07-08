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
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { optimizeAdmin } from "@/utils/imageUtils";
import { Pencil, Plus, Search, Trash, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { productApi } from "../../api/productApi";
import { fetchCategories } from "../../store/slices/categorySlice";
import { fetchProducts } from "../../store/slices/productSlice";
import ProductForm from "./ProductForm";

const AdminProducts = () => {
	const dispatch = useDispatch();
	const { toast } = useToast();
	const {
		items: products,
		loading,
		pagination,
	} = useSelector((state) => state.products);
	const { items: categories } = useSelector((state) => state.categories);

	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [selectAll, setSelectAll] = useState(false);
	const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

	const [debouncedSearch, setDebouncedSearch] = useState("");
	const timerRef = useRef(null);

	useEffect(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}
		timerRef.current = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [search]);

	useEffect(() => {
		setPage(1);
	}, [search]);

	useEffect(() => {
		const params = {
			page,
			limit: 10,
		};
		if (debouncedSearch && debouncedSearch.trim() !== "") {
			params.search = debouncedSearch.trim();
		}
		dispatch(fetchProducts(params));
		setSelectedProducts([]);
		setSelectAll(false);
	}, [dispatch, page, debouncedSearch]);

	useEffect(() => {
		dispatch(fetchCategories());
	}, [dispatch]);

	useEffect(() => {
		if (selectAll) {
			setSelectedProducts(products.map((p) => p._id));
		} else {
			setSelectedProducts([]);
		}
	}, [selectAll, products]);

	const handleSelectProduct = (productId) => {
		setSelectedProducts((prev) => {
			if (prev.includes(productId)) {
				return prev.filter((id) => id !== productId);
			} else {
				return [...prev, productId];
			}
		});
	};

	const handleSelectAll = () => {
		setSelectAll(!selectAll);
	};

	const handleBulkDelete = async () => {
		try {
			await Promise.all(
				selectedProducts.map((id) => productApi.deleteProduct(id)),
			);
			toast({
				title: "Xóa thành công",
				description: `Đã xóa ${selectedProducts.length} sản phẩm`,
			});
			setIsBulkDeleteDialogOpen(false);
			setSelectedProducts([]);
			setSelectAll(false);
			const params = {
				page,
				limit: 10,
			};
			if (debouncedSearch && debouncedSearch.trim() !== "") {
				params.search = debouncedSearch.trim();
			}
			dispatch(fetchProducts(params));
		} catch (error) {
			toast({
				title: "Lỗi xóa hàng loạt",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async () => {
		try {
			await productApi.deleteProduct(deleteTarget._id);
			toast({
				title: "Xóa thành công",
				description: "Sản phẩm đã được xóa",
			});
			setDeleteTarget(null);
			const params = {
				page,
				limit: 10,
			};
			if (debouncedSearch && debouncedSearch.trim() !== "") {
				params.search = debouncedSearch.trim();
			}
			dispatch(fetchProducts(params));
		} catch (error) {
			toast({
				title: "Lỗi xóa sản phẩm",
				variant: "destructive",
			});
		}
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setIsDialogOpen(true);
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
		setEditingProduct(null);
		const params = {
			page,
			limit: 10,
		};
		if (debouncedSearch && debouncedSearch.trim() !== "") {
			params.search = debouncedSearch.trim();
		}
		dispatch(fetchProducts(params));
	};

	const handleClearSearch = () => {
		setSearch("");
		setDebouncedSearch("");
		setPage(1);
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl font-display text-brand-text
						Quản lý sản phẩm
					</h1>
					<p className="text-sm text-gray-500 sm:text-base">
						Quản lý danh sách sản phẩm của cửa hàng
					</p>
				</div>
				<div className="flex gap-2">
					{selectedProducts.length > 0 && (
						<Button
							variant="destructive"
							onClick={() => setIsBulkDeleteDialogOpen(true)}
							className="flex items-center gap-2"
						>
							<Trash className="w-4 h-4" />
							Xóa {selectedProducts.length} sản phẩm
						</Button>
					)}
					<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
						<DialogTrigger asChild>
							<Button className="text-white bg-brand-primary hover:bg-brand-accent">
								<Plus className="w-4 h-4 mr-2" />
								Thêm sản phẩm
							</Button>
						</DialogTrigger>
						<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto
							<DialogHeader>
								<DialogTitle className="">
									{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
								</DialogTitle>
							</DialogHeader>
							<ProductForm
								product={editingProduct}
								categories={categories}
								onSuccess={handleDialogClose}
								onCancel={() => {
									setIsDialogOpen(false);
									setEditingProduct(null);
								}}
							/>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			{/* Search */}
			<div className="flex flex-wrap items-center gap-4">
				<div className="relative flex-1 max-w-sm">
					<Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
					<Input
						placeholder="Tìm kiếm sản phẩm..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10 pr-10
					/>
					{search && (
						<button
							onClick={handleClearSearch}
							className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
				{debouncedSearch && (
					<div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
						Kết quả: {pagination.total} sản phẩm
					</div>
				)}
				{search && (
					<Button
						variant="outline"
						size="sm"
						onClick={handleClearSearch}
						className="text-sm
					>
						Hiển thị tất cả
					</Button>
				)}
			</div>

			{/* Table */}
			<div className="overflow-hidden bg-white shadow-sm rounded-xl">
				<div className="hidden overflow-x-auto md:block">
					<Table>
						<TableHeader>
							<TableRow className="">
								<TableHead className="w-10
									<Checkbox
										checked={selectAll}
										onCheckedChange={handleSelectAll}
										className=""
									/>
								</TableHead>
								<TableHead className="w-16
								<TableHead className="w-16
								<TableHead className="">
									Tên sản phẩm
								</TableHead>
								<TableHead className="mục</TableHead>
								<TableHead className="">Giá</TableHead>
								<TableHead className="thái</TableHead>
								<TableHead className="text-right
									Thao tác
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={8} className="py-8 text-center">
										<div className="flex items-center justify-center">
											<div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
										</div>
									</TableCell>
								</TableRow>
							) : products.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={8}
										className="py-8 text-center text-gray-500
									>
										{debouncedSearch
											? "Không tìm thấy sản phẩm nào phù hợp"
											: "Chưa có sản phẩm nào"}
									</TableCell>
								</TableRow>
							) : (
								products.map((product, index) => (
									<TableRow key={product._id} className="">
										<TableCell>
											<Checkbox
												checked={selectedProducts.includes(product._id)}
												onCheckedChange={() => handleSelectProduct(product._id)}
												className=""
											/>
										</TableCell>
										<TableCell className="">
											{(page - 1) * 10 + index + 1}
										</TableCell>
										<TableCell>
											<img
												src={optimizeAdmin(
													product.images?.[0] || "/placeholder.jpg",
												)}
												alt={product.name}
												className="object-cover w-12 h-12 rounded-lg"
												width="48"
												height="48"
												loading="lazy"
												decoding="async"
											/>
										</TableCell>
										<TableCell className="font-medium line-clamp-1">
											{product.name}
										</TableCell>
										<TableCell className="">
											{product.category?.name || "N/A"}
										</TableCell>
										<TableCell>
											<div className="flex flex-col">
												<span className="font-medium text-brand-primary
													{new Intl.NumberFormat("vi-VN").format(product.price)}
													đ
												</span>
												{product.originalPrice &&
													product.originalPrice > product.price && (
														<span className="text-xs text-gray-400 line-through
															{new Intl.NumberFormat("vi-VN").format(
																product.originalPrice,
															)}
															đ
														</span>
													)}
											</div>
										</TableCell>
										<TableCell>
											<Badge
												className={
													product.isActive ? "bg-green-500" : "bg-red-500"
												}
											>
												{product.isActive ? "Hiển thị" : "Ẩn"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleEdit(product)}
													className=""
												>
													<Pencil className="w-4 h-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => setDeleteTarget(product)}
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
						<div className="flex items-center justify-center py-8">
							<div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
						</div>
					) : products.length === 0 ? (
						<p className="py-8 text-center text-gray-500
							{debouncedSearch
								? "Không tìm thấy sản phẩm nào phù hợp"
								: "Chưa có sản phẩm nào"}
						</p>
					) : (
						products.map((product) => (
							<div
								key={product._id}
								className="p-4 bg-white border rounded-lg shadow-sm
							>
								<div className="flex items-start gap-4">
									<Checkbox
										checked={selectedProducts.includes(product._id)}
										onCheckedChange={() => handleSelectProduct(product._id)}
										className="mt-1
									/>
									<img
										src={optimizeAdmin(
											product.images?.[0] || "/placeholder.jpg",
										)}
										alt={product.name}
										className="flex-shrink-0 object-cover w-20 h-20 rounded-lg"
										width="80"
										height="80"
										loading="lazy"
										decoding="async"
									/>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-brand-text line-clamp-1">
											{product.name}
										</h3>
										<p className="text-sm text-gray-500
											{product.category?.name || "N/A"}
										</p>
										<div className="flex items-center gap-2 mt-1">
											<span className="font-bold text-brand-primary
												{new Intl.NumberFormat("vi-VN").format(product.price)}đ
											</span>
											{product.originalPrice &&
												product.originalPrice > product.price && (
													<span className="text-xs text-gray-400 line-through
														{new Intl.NumberFormat("vi-VN").format(
															product.originalPrice,
														)}
														đ
													</span>
												)}
										</div>
										<Badge
											className={`mt-1 ${product.isActive ? "bg-green-500" : "bg-red-500"}`}
										>
											{product.isActive ? "Hiển thị" : "Ẩn"}
										</Badge>
									</div>
									<div className="flex flex-col flex-shrink-0 gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleEdit(product)}
											className=""
										>
											<Pencil className="w-4 h-4" />
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => setDeleteTarget(product)}
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

			{/* Pagination */}
			{pagination.totalPages > 1 && (
				<div className="flex flex-wrap justify-center gap-2">
					<Button
						variant="outline"
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page <= 1}
						size="sm"
						className=""
					>
						Trước
					</Button>
					<span className="flex items-center px-4 text-sm text-gray-700
						Trang {page} / {pagination.totalPages}
					</span>
					<Button
						variant="outline"
						onClick={() =>
							setPage((p) => Math.min(pagination.totalPages, p + 1))
						}
						disabled={page >= pagination.totalPages}
						size="sm"
						className=""
					>
						Sau
					</Button>
				</div>
			)}

			{/* Delete Single Confirmation */}
			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
			>
				<AlertDialogContent className="">
					<AlertDialogHeader>
						<AlertDialogTitle className="">
							Xác nhận xóa sản phẩm
						</AlertDialogTitle>
						<AlertDialogDescription className="">
							Bạn có chắc chắn muốn xóa sản phẩm "{deleteTarget?.name}"? Hành
							động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="">
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-500 hover:bg-red-600"
						>
							Xóa
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Bulk Delete Confirmation */}
			<AlertDialog
				open={isBulkDeleteDialogOpen}
				onOpenChange={setIsBulkDeleteDialogOpen}
			>
				<AlertDialogContent className="">
					<AlertDialogHeader>
						<AlertDialogTitle className="">
							Xác nhận xóa hàng loạt
						</AlertDialogTitle>
						<AlertDialogDescription className="">
							Bạn có chắc chắn muốn xóa {selectedProducts.length} sản phẩm đã
							chọn? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="">
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleBulkDelete}
							className="bg-red-500 hover:bg-red-600"
						>
							Xóa tất cả
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default AdminProducts;
