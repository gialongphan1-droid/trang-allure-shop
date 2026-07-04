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
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryApi } from "../../api/productApi";
import { fetchCategories } from "../../store/slices/categorySlice";

const AdminCategories = () => {
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { items: categories, loading } = useSelector(
		(state) => state.categories,
	);

	const [search, setSearch] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingCategory, setEditingCategory] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [formData, setFormData] = useState({
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
			setEditingCategory(category);
			setFormData({
				name: category.name || "",
				description: category.description || "",
				icon: category.icon || "",
				isActive: category.isActive !== undefined ? category.isActive : true,
			});
		} else {
			setEditingCategory(null);
			setFormData({
				name: "",
				description: "",
				icon: "",
				isActive: true,
			});
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
			setIsDialogOpen(false);
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

	const handleClearSearch = () => {
		setSearch("");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h1 className="text-2xl font-bold sm:text-3xl font-display text-brand-text dark:text-white">
						Quản lý danh mục
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
						Quản lý danh mục sản phẩm của cửa hàng
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button
							className="w-full text-white sm:w-auto bg-brand-primary hover:bg-brand-accent"
							onClick={() => handleOpenDialog()}
						>
							<Plus className="w-4 h-4 mr-2" />
							Thêm danh mục
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
						<DialogHeader>
							<DialogTitle className="dark:text-white">
								{editingCategory ? "Sửa danh mục" : "Thêm danh mục mới"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name" className="dark:text-gray-300">
									Tên danh mục *
								</Label>
								<Input
									id="name"
									value={formData.name}
									onChange={(e) =>
										setFormData({ ...formData, name: e.target.value })
									}
									required
									className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:text-gray-500"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="icon" className="dark:text-gray-300">
									Icon (Emoji)
								</Label>
								<Input
									id="icon"
									value={formData.icon}
									onChange={(e) =>
										setFormData({ ...formData, icon: e.target.value })
									}
									placeholder="VD: 💄, 🧴, 👁️"
									className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:text-gray-500"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="description" className="dark:text-gray-300">
									Mô tả
								</Label>
								<Textarea
									id="description"
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									rows={3}
									className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:text-gray-500"
								/>
							</div>
							<div className="flex items-center space-x-2">
								<input
									type="checkbox"
									id="isActive"
									checked={formData.isActive}
									onChange={(e) =>
										setFormData({ ...formData, isActive: e.target.checked })
									}
									className="w-4 h-4 border-gray-300 rounded text-brand-primary focus:ring-brand-primary dark:border-gray-600 dark:bg-gray-700"
								/>
								<Label
									htmlFor="isActive"
									className="cursor-pointer dark:text-gray-300"
								>
									Hiển thị danh mục
								</Label>
							</div>
							<div className="sticky bottom-0 flex justify-end gap-3 pt-4 bg-white border-t dark:bg-gray-800 dark:border-gray-700">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
									className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
								>
									Hủy
								</Button>
								<Button
									type="submit"
									className="text-white bg-brand-primary hover:bg-brand-accent"
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
					<Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 dark:text-gray-500 left-3 top-1/2" />
					<Input
						placeholder="Tìm kiếm danh mục..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:text-gray-500"
					/>
					{search && (
						<button
							onClick={handleClearSearch}
							className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
						>
							<X className="w-4 h-4" />
						</button>
					)}
				</div>
				{search && (
					<div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
						Kết quả: {filteredCategories.length} danh mục
					</div>
				)}
			</div>

			{/* Table */}
			<div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl">
				<div className="hidden overflow-x-auto md:block">
					<Table>
						<TableHeader>
							<TableRow className="dark:border-gray-700">
								<TableHead className="w-16 dark:text-gray-300">STT</TableHead>
								<TableHead className="w-16 dark:text-gray-300">Icon</TableHead>
								<TableHead className="dark:text-gray-300">Tên danh mục</TableHead>
								<TableHead className="dark:text-gray-300">Slug</TableHead>
								<TableHead className="dark:text-gray-300">Mô tả</TableHead>
								<TableHead className="dark:text-gray-300">Trạng thái</TableHead>
								<TableHead className="text-right dark:text-gray-300">Thao tác</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={7} className="py-8 text-center">
										<div className="flex items-center justify-center">
											<div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
										</div>
									</TableCell>
								</TableRow>
							) : filteredCategories.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="py-8 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500"
									>
										{search
											? "Không tìm thấy danh mục nào phù hợp"
											: "Chưa có danh mục nào"}
									</TableCell>
								</TableRow>
							) : (
								filteredCategories.map((cat, index) => (
									<TableRow key={cat._id} className="dark:border-gray-700">
										<TableCell className="dark:text-gray-300">{index + 1}</TableCell>
										<TableCell className="text-2xl">
											{cat.icon || "📦"}
										</TableCell>
										<TableCell className="font-medium dark:text-white">{cat.name}</TableCell>
										<TableCell className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
											{cat.slug}
										</TableCell>
										<TableCell className="max-w-xs truncate dark:text-gray-300">
											{cat.description || "—"}
										</TableCell>
										<TableCell>
											<Badge
												className={cat.isActive ? "bg-green-500" : "bg-red-500"}
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
													className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
												>
													<Pencil className="w-4 h-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => setDeleteTarget(cat)}
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
					) : filteredCategories.length === 0 ? (
						<p className="py-8 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500">
							{search
								? "Không tìm thấy danh mục nào phù hợp"
								: "Chưa có danh mục nào"}
						</p>
					) : (
						filteredCategories.map((cat) => (
							<div
								key={cat._id}
								className="p-4 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
							>
								<div className="flex items-center gap-4">
									<div className="text-3xl">{cat.icon || "📦"}</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-brand-text dark:text-white">
											{cat.name}
										</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">Slug: {cat.slug}</p>
										{cat.description && (
											<p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{cat.description}</p>
										)}
										<Badge
											className={`mt-1 ${cat.isActive ? "bg-green-500" : "bg-red-500"}`}
										>
											{cat.isActive ? "Hiển thị" : "Ẩn"}
										</Badge>
									</div>
									<div className="flex flex-col gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleOpenDialog(cat)}
											className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
										>
											<Pencil className="w-4 h-4" />
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => setDeleteTarget(cat)}
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
			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
			>
				<AlertDialogContent className="dark:bg-gray-800 dark:border-gray-700">
					<AlertDialogHeader>
						<AlertDialogTitle className="dark:text-white">Xác nhận xóa danh mục</AlertDialogTitle>
						<AlertDialogDescription className="dark:text-gray-400 dark:text-gray-500">
							Bạn có chắc chắn muốn xóa danh mục "{deleteTarget?.name}"? Hành
							động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600">
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
		</div>
	);
};

export default AdminCategories;