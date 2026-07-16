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
import { optimizeAdmin } from "@/utils/imageUtils";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { bannerApi } from "../../api/productApi";

// ✅ Lazy load ImageUpload (chỉ tải khi mở dialog)
const ImageUpload = lazy(() => import("@/components/common/ImageUpload"));

// ✅ Loading fallback cho ImageUpload
const ImageUploadLoader = () => (
	<div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg border-border">
		<div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
	</div>
);

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

	const fetchBanners = async () => {
		try {
			setLoading(true);
			const response = await bannerApi.getBanners();
			setBanners(response.data || []);
		} catch {
			toast({
				title: "Lỗi tải banner",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchBanners();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
				description: error.message || "Có lỗi xảy ra",
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
					<h1 className="text-2xl font-bold sm:text-3xl font-display text-brand-text">
						Quản lý banner
					</h1>
					<p className="text-sm text-muted-foreground sm:text-base">
						Quản lý banner hiển thị trên trang chủ
					</p>
				</div>
				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button
							className="w-full text-white sm:w-auto bg-brand-primary hover:bg-brand-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
							onClick={() => handleOpenDialog()}
						>
							<Plus className="w-4 h-4 mr-2" />
							Thêm banner
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
						<DialogHeader>
							<DialogTitle className="font-display text-brand-text">
								{editingBanner ? "Sửa banner" : "Thêm banner mới"}
							</DialogTitle>
						</DialogHeader>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="title" className="text-brand-text">
									Tiêu đề
								</Label>
								<Input
									id="title"
									value={formData.title}
									onChange={(e) =>
										setFormData({ ...formData, title: e.target.value })
									}
									placeholder="Tiêu đề banner"
									className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label className="text-brand-text">
									Ảnh <span className="text-destructive">*</span>
								</Label>
								<Suspense fallback={<ImageUploadLoader />}>
									<ImageUpload
										value={formData.image ? [formData.image] : []}
										onChange={(images) =>
											setFormData({ ...formData, image: images[0] || "" })
										}
										multiple={false}
									/>
								</Suspense>
							</div>

							<div className="space-y-2">
								<Label htmlFor="link" className="text-brand-text">
									Đường dẫn (Link)
								</Label>
								<Input
									id="link"
									value={formData.link}
									onChange={(e) =>
										setFormData({ ...formData, link: e.target.value })
									}
									placeholder="/san-pham hoặc https://..."
									className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="position" className="text-brand-text">
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
									className="transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
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
									className="w-4 h-4 border-border rounded text-brand-primary focus:ring-brand-primary focus:ring-2 transition-all duration-200"
								/>
								<Label
									htmlFor="isActive"
									className="cursor-pointer text-muted-foreground"
								>
									Hiển thị banner
								</Label>
							</div>

							<div className="flex justify-end gap-3 pt-4 border-t border-border">
								<Button
									type="button"
									variant="outline"
									onClick={() => setIsDialogOpen(false)}
									className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
								>
									Hủy
								</Button>
								<Button
									type="submit"
									className="text-white bg-brand-primary hover:bg-brand-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
					<Search className="absolute w-4 h-4 text-muted-foreground -translate-y-1/2 left-3 top-1/2" />
					<Input
						placeholder="Tìm kiếm banner..."
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
						Kết quả: {filteredBanners.length} banner
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
								<TableHead className="w-24">Hình ảnh</TableHead>
								<TableHead>Tiêu đề</TableHead>
								<TableHead>Đường dẫn</TableHead>
								<TableHead>Vị trí</TableHead>
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
							) : filteredBanners.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="py-12 text-center text-muted-foreground"
									>
										{search
											? "Không tìm thấy banner nào phù hợp"
											: "Chưa có banner nào"}
									</TableCell>
								</TableRow>
							) : (
								filteredBanners.map((banner, index) => (
									<TableRow key={banner._id} className="hover:bg-brand-primary/5 transition-colors">
										<TableCell>{index + 1}</TableCell>
										<TableCell>
											<img
												src={optimizeAdmin(banner.image)}
												alt={banner.title || "Banner"}
												loading="lazy"
												className="object-cover w-16 h-10 rounded-lg border border-border"
												width="64"
												height="40"
												decoding="async"
											/>
										</TableCell>
										<TableCell className="font-medium text-brand-text">
											{banner.title || "Không có tiêu đề"}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">
											{banner.link || "—"}
										</TableCell>
										<TableCell className="text-center">
											<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted/50 text-sm font-medium">
												{banner.position || 0}
											</span>
										</TableCell>
										<TableCell>
											<Badge
												className={
													banner.isActive 
														? "bg-green-500 hover:bg-green-600" 
														: "bg-destructive hover:bg-destructive/90"
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
													className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
												>
													<Pencil className="w-4 h-4" />
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => setDeleteTarget(banner)}
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
					) : filteredBanners.length === 0 ? (
						<p className="py-12 text-center text-muted-foreground">
							{search
								? "Không tìm thấy banner nào phù hợp"
								: "Chưa có banner nào"}
						</p>
					) : (
						filteredBanners.map((banner) => (
							<div
								key={banner._id}
								className="p-4 bg-white border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
							>
								<div className="flex gap-4">
									<img
										src={optimizeAdmin(banner.image)}
										alt={banner.title || "Banner"}
										loading="lazy"
										className="object-cover w-20 h-16 rounded-lg border border-border"
										width="80"
										height="64"
										decoding="async"
									/>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-brand-text truncate">
											{banner.title || "Không có tiêu đề"}
										</h3>
										<p className="text-sm text-muted-foreground truncate">
											{banner.link || "—"}
										</p>
										<p className="text-sm text-muted-foreground">
											Vị trí: <span className="font-medium">{banner.position || 0}</span>
										</p>
										<Badge
											className={`mt-1 ${
												banner.isActive 
													? "bg-green-500 hover:bg-green-600" 
													: "bg-destructive hover:bg-destructive/90"
											}`}
										>
											{banner.isActive ? "Hiển thị" : "Ẩn"}
										</Badge>
									</div>
									<div className="flex flex-col gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleOpenDialog(banner)}
											className="hover:border-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 transition-all duration-200"
										>
											<Pencil className="w-4 h-4" />
										</Button>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => setDeleteTarget(banner)}
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
			<AlertDialog
				open={!!deleteTarget}
				onOpenChange={() => setDeleteTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="font-display text-brand-text">
							Xác nhận xóa banner
						</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn xóa banner "
							<span className="font-medium text-foreground">{deleteTarget?.title || "không tên"}</span>"? Hành động này không thể hoàn tác.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-destructive text-white hover:bg-destructive/90"
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