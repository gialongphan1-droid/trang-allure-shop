import { adminApi } from "@/api/productApi";
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
import { useToast } from "@/components/ui/use-toast";
import {
	Eye,
	FolderTree,
	Image,
	LayoutDashboard,
	LogOut,
	Menu,
	Package,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	const navigate = useNavigate();
	const { toast } = useToast();

	// ✅ KIỂM TRA AUTH KHI COMPONENT MOUNT
	useEffect(() => {
		const checkAuth = async () => {
			try {
				await adminApi.getMe();
			} catch {
				// ✅ XÓA TOKEN NẾU KHÔNG HỢP LỆ
				localStorage.removeItem("adminToken");
				localStorage.removeItem("adminRefreshToken");
				navigate("/admin/login");
			}
		};
		checkAuth();
	}, [navigate]);

	useEffect(() => {
		const checkScreen = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth >= 768) {
				setIsSidebarOpen(true);
			} else {
				setIsSidebarOpen(false);
			}
		};
		checkScreen();
		window.addEventListener("resize", checkScreen);
		return () => window.removeEventListener("resize", checkScreen);
	}, []);

	const handleLogout = async () => {
		try {
			await adminApi.logout();
			toast({
				title: "Đăng xuất thành công",
			});
		} catch (error) {
			console.error("Logout error:", error);
			toast({
				title: "Lỗi đăng xuất",
				variant: "destructive",
			});
		} finally {
			// ✅ XÓA TOKEN KHỎI localStorage (QUAN TRỌNG!)
			localStorage.removeItem("adminToken");
			localStorage.removeItem("adminRefreshToken");
			console.log("🗑️ Token removed from localStorage");

			setShowLogoutDialog(false);
			navigate("/admin/login", { replace: true });
		}
	};

	const viewAsCustomer = () => {
		window.location.href = "/";
	};

	const menuItems = [
		{ icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
		{ icon: Package, label: "Sản phẩm", path: "/admin/products" },
		{ icon: FolderTree, label: "Danh mục", path: "/admin/categories" },
		{ icon: Image, label: "Banner", path: "/admin/banners" },
	];

	return (
		<div className="flex min-h-screen bg-background text-foreground">
			{/* Overlay cho mobile */}
			{isMobile && isSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}

			{/* Sidebar */}
			<aside
				className={`
					fixed top-0 left-0 h-full bg-brand-text text-white shadow-2xl transition-all duration-300 z-50
					${isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"}
					md:translate-x-0 md:w-64
				`}
			>
				<div className="flex items-center justify-between p-4 border-b border-white/10">
					<h1 className="text-xl font-bold text-white font-display">
						🌸 TrangAllure
					</h1>
					<Button
						variant="ghost"
						size="icon"
						className="text-white/70 hover:text-white hover:bg-white/10 md:hidden"
						onClick={() => setIsSidebarOpen(false)}
					>
						<X className="w-5 h-5" />
					</Button>
				</div>

				<nav className="p-3 space-y-1">
					{menuItems.map((item) => (
						<Link
							key={item.path}
							to={item.path}
							className={`
								flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
								hover:bg-white/10 hover:translate-x-1
								${window.location.pathname === item.path ? "bg-white/15 shadow-inner" : ""}
							`}
							onClick={() => isMobile && setIsSidebarOpen(false)}
						>
							<item.icon className="flex-shrink-0 w-5 h-5 opacity-70" />
							<span className="font-medium text-white/90">{item.label}</span>
							{window.location.pathname === item.path && (
								<span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-secondary" />
							)}
						</Link>
					))}
				</nav>

				<div className="px-3 py-2 border-t border-white/10">
					<Button
						variant="ghost"
						className="flex items-center justify-start w-full gap-3 text-white/70 hover:text-white hover:bg-white/10"
						onClick={viewAsCustomer}
					>
						<Eye className="w-5 h-5" />
						<span className="font-medium">Xem trang khách hàng</span>
						<span className="ml-auto text-xs opacity-40">↗</span>
					</Button>
				</div>

				<div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
					<Button
						variant="ghost"
						className="flex items-center justify-start w-full gap-3 text-white/70 hover:text-white hover:bg-white/10"
						onClick={() => setShowLogoutDialog(true)}
					>
						<LogOut className="w-5 h-5" />
						<span className="font-medium">Đăng xuất</span>
					</Button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 md:ml-64">
				<header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-border shadow-sm">
					<div className="flex items-center justify-between px-4 py-3 md:px-6">
						<div className="flex items-center gap-3">
							<Button
								variant="ghost"
								size="icon"
								className="md:hidden"
								onClick={() => setIsSidebarOpen(true)}
							>
								<Menu className="w-5 h-5" />
							</Button>
							<h2 className="text-lg font-semibold text-brand-text">
								{menuItems.find(
									(item) => window.location.pathname === item.path,
								)?.label || "Dashboard"}
							</h2>
						</div>

						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="sm"
								onClick={viewAsCustomer}
								className="items-center hidden gap-2 md:flex border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200"
							>
								<Eye className="w-4 h-4" />
								Xem trang khách hàng
								<span className="text-xs opacity-60">↗</span>
							</Button>
						</div>
					</div>
				</header>

				<div className="p-4 md:p-6">
					<Outlet />
				</div>
			</main>

			{/* Dialog xác nhận đăng xuất */}
			<AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
						<AlertDialogDescription>
							Bạn có chắc chắn muốn đăng xuất khỏi tài khoản admin?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Hủy</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleLogout}
							className="bg-brand-primary text-white hover:bg-brand-accent"
						>
							Đăng xuất
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default AdminLayout;