import ImageUpload from "@/components/common/ImageUpload";
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
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { bannerApi } from "../../api/productApi";

const AdminBanners = () => {
	const { toast } = useToast();
	const [banners, setBanners] = useState([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingBanner, setEditingBanner] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [formData, setFormData] = useState({
		title: "",
		image: "",
		link: "",
		position: 0,
		isActive: true,
	});

	useEffect(() => {
		fetchBanners();
	}, []);

	const fetchBanners = async () => {
		try {
			const response = await bannerApi.getBanners();
			setBanners(response.data || []);
		} catch (error) {
			toast({
				title: "Lỗi tải banner",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const filteredBanners = banners.filter(
		(banner) =>
			banner.title?.toLowerCase().includes(search.toLowerCase()) ||
			banner.link?.toLowerCase().includes(search.toLowerCase()),
	);

	const handleOpenDialog = (banner = null) => {
		if (banner) {
			setEditingBanner(banner);
			setFormData({
				title: banner.title || "",
				image: banner.image || "",
				link: banner.link || "",
				position: banner.position || 0,
				isActive: banner.isActive !== undefined ? banner.isActive : true,
			});
		} else {
			setEditingBanner(null);
			setFormData({
				title: "",
				image: "",
				link: "",
				position: 0,
				isActive: true,
			});
		}
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (editingBanner) {
				await bannerApi.updateBanner(editingBanner._id, formData);
				toast({
					title: "Cập nhật thành công",
					description: "Banner đã được cập nhật",
				});
			} else {
				await bannerApi.createBanner(formData);
				toast({
					title: "Thêm thành công",
					description: "Banner mới đã được tạo",
				});
			}
			setIsDialogOpen(false);
			fetchBanners();
		} catch (error) {
			toast({
				title: "Lỗi",
				description: error.message || "C有 lỗi xảy ra",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async () => {
		try {
			await bannerApi.deleteBanner(deleteTarget._id);
			toast({
				title: "Xóa thành công",
				description: "Banner đã được xóa",
			});
			setDeleteTarget(null);
			fetchBanners();
		} catch (error) {
			toast({
				title: "Lỗi xóa",
				description: error.message || "Không thể xóa banner này",
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
						Quản lý banner
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
						Quản lý banner hiển thị trên trang chủ
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button
							className="w-full text-white sm:w-auto bg-brand-primary hover:bg-brand-accent"
							onClick={() => handleOpenDialog()}
						>
							<Plus className="w-4 h-4 mr-2" />
							Thêm banner
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
						<DialogHeader>
							<DialogTitle className="dark:text-white">
								{editingBanner ? "Sửa banner" : "Thêm banner mới"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title" className="dark:text-gray-300">
									Tiêu đề
								</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									placeholder="Tiêu đề banner"
									className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
								/>
							</div>

							<div className="space-y-2">
								<Label className="dark:text-gray-300">Hình ảnh *</Label>
								<ImageUpload
									value={formData.image ? [formData.image] : []}
									onChange={(images) =>
										setFormData({ ...formData, image: images[0] || "" })
									}
									multiple={false}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="link" className="dark:text-gray-300">
									Đường dẫn (Link)
								</Label>
								<Input
									id="link"
									value={formData.link}
									onChange={(e) =>
										setFormData({ ...formData, link: e.target.value })
									}
									placeholder="/san-pham hoặc https://..."
									className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="position" className="dark:text-gray-300">
									Vị trí hiển thị
								</Label>
								<Input
									id="position"
									type="number"
									value={formData.position}
									onChange={(e) =>
										setFormData({
											...formData,
											position: Number(e.target.value),
										})
									}
									min="0"
									className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
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
									Hiển thị banner
								</Label>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
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
									{editingBanner ? "Cập nhật" : "Thêm mới"}
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
						placeholder="Tìm kiếm banner..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-10 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
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
			</div>

			{/* Table */}
			<div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 rounded-xl">
				<div className="hidden overflow-x-auto md:block">
					<Table>
						<TableHeader>
							<TableRow className="dark:border-gray-700">
								<TableHead className="w-16 dark:text-gray-300">STT</TableHead>
								<TableHead className="w-24 dark:text-gray-300">Hình ảnh</TableHead>
								<TableHead className="dark:text-gray-300">Tiêu đề</TableHead>
								<TableHead className="dark:text-gray-300">Đường dẫn</TableHead>
								<TableHead className="dark:text-gray-300">Vị trí</TableHead>
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
							) : filteredBanners.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="py-8 text-center text-gray-500 dark:text-gray-400"
									>
										{search
											? "Không tìm thấy banner nào phù hợp"
											: "Chưa có banner nào"}
									</TableCell>
								</TableRow>
							) : (
								filteredBanners.map((banner, index) => (
									<TableRow key={banner._id} className="dark:border-gray-700">
										<TableCell className="dark:text-gray-300">{index + 1}</TableCell>
										<TableCell>
											<img
												src={banner.image}
												alt={banner.title || "Banner"}
												loading="lazy"
												className="object-cover w-16 h-10 rounded-lg"
											/>
										</TableCell>
										<TableCell className="font-medium dark:text-white">
											{banner.title || "Không có tiêu đề"}
										</TableCell>
										<TableCell className="text-sm text-gray-500 dark:text-gray-400">
											{banner.link || "—"}
										</TableCell>
										<TableCell className="dark:text-gray-300">{banner.position || 0}</TableCell>
										<TableCell>
											<Badge
												className={
													banner.isActive ? "bg-green-500" : "bg-red-500"
												}
											>
												{banner.isActive ? "Hiển thị" : "Ẩn"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleOpenDialog(banner)}
													className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
												>
													<Pencil className="w-4 h-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => setDeleteTarget(banner)}
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
					) : filteredBanners.length === 0 ? (
						<p className="py-8 text-center text-gray-500 dark:text-gray-400">
							{search
								? "Không tìm thấy banner nào phù hợp"
								: "Chưa có banner nào"}
						</p>
					) : (
						filteredBanners.map((banner) => (
							<div
								key={banner._id}
								className="p-4 bg-white border rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
							>
								<div className="flex gap-4">
									<img
										src={banner.image}
										alt={banner.title || "Banner"}
										loading="lazy"
										className="object-cover w-20 h-16 rounded-lg"
									/>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-brand-text dark:text-white">
											{banner.title || "Không có tiêu đề"}
										</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{banner.link || "—"}
										</p>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Vị trí: {banner.position || 0}
										</p>
										<Badge
											className={`mt-1 ${banner.isActive ? "bg-green-500" : "bg-red-500"}`}
										>
											{banner.isActive ? "Hiển thị" : "Ẩn"}
										</Badge>
									</div>
									<div className="flex flex-col gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleOpenDialog(banner)}
											className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
										>
											<Pencil className="w-4 h-4" />
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => setDeleteTarget(banner)}
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
						<AlertDialogTitle className="dark:text-white">Xác nhận xóa banner</AlertDialogTitle>
						<AlertDialogDescription className="dark:text-gray-400">
							Bạn có chắc chắn muốn xóa banner "
							{deleteTarget?.title || "không tên"}"? Hành động này không thể
							hoàn tác.
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

export default AdminBanners;