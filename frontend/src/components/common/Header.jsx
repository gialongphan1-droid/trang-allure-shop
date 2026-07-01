import { adminApi } from "@/api/productApi";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, Moon, Search, Shield, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const Header = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [adminName, setAdminName] = useState("");
	const [showLogoutDialog, setShowLogoutDialog] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const navigate = useNavigate();
	const hasChecked = useRef(false);
	const { isDark, toggleTheme } = useTheme();

	// Kiểm tra trạng thái đăng nhập admin
	useEffect(() => {
		if (hasChecked.current) return;
		hasChecked.current = true;

		const checkAdminStatus = async () => {
			// ✅ KIỂM TRA COOKIE TRƯỚC - KHÔNG GỌI API NẾU CHƯA ĐĂNG NHẬP
			const hasToken = document.cookie
				.split(";")
				.some((c) => c.trim().startsWith("token="));
			if (!hasToken) {
				setIsAdmin(false);
				setAdminName("");
				return;
			}

			try {
				const response = await adminApi.getMe();
				if (response.success && response.data) {
					setIsAdmin(true);
					setAdminName(response.data.name || "Admin");
				}
			} catch (error) {
				setIsAdmin(false);
				setAdminName("");
			}
		};
		checkAdminStatus();
	}, []);

	const handleLogout = async () => {
		try {
			await adminApi.logout();
			setIsAdmin(false);
			setAdminName("");
			setShowLogoutDialog(false);
			navigate("/");
			window.location.reload();
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchQuery.trim()) {
			navigate(`/san-pham?search=${encodeURIComponent(searchQuery)}`);
			setSearchQuery("");
			setIsMenuOpen(false);
		}
	};

	return (
		<header className="sticky top-0 z-50 transition-colors bg-white shadow-sm dark:bg-gray-900">
			<div className="flex items-center justify-between py-4 container-custom">
				{/* Logo */}
				<Link
					to="/"
					className="text-2xl font-bold transition md:text-3xl font-display text-brand-text dark:text-white hover:text-brand-primary dark:hover:text-brand-primary whitespace-nowrap"
				>
					Trang Allure Shop
				</Link>

				{/* Navigation - Desktop */}
				<nav className="items-center hidden gap-6 md:flex">
					<Link
						to="/"
						className="text-base font-medium text-gray-600 transition dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary"
					>
						Trang chủ
					</Link>
					<Link
						to="/san-pham"
						className="text-base font-medium text-gray-600 transition dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary"
					>
						Sản phẩm
					</Link>
					<Link
						to="/lien-he"
						className="text-base font-medium text-gray-600 transition dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary"
					>
						Liên hệ
					</Link>

					{/* Dark Mode Toggle */}
					<button
						onClick={toggleTheme}
						className="p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
						aria-label="Toggle theme"
					>
						{isDark ? (
							<Sun className="w-5 h-5 text-yellow-400" />
						) : (
							<Moon className="w-5 h-5 text-gray-600" />
						)}
					</button>

					{isAdmin && (
						<div className="flex items-center gap-3 pl-4 ml-4 border-l border-gray-200 dark:border-gray-700">
							{window.location.pathname === "/" ? (
								<Button
									size="sm"
									className="text-white bg-brand-primary hover:bg-brand-accent"
									onClick={() => navigate("/admin/dashboard")}
								>
									<ArrowLeft className="w-4 h-4 mr-1" />
									Quay lại Admin
								</Button>
							) : (
								<Link to="/admin/dashboard">
									<Button
										variant="outline"
										size="sm"
										className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white dark:border-brand-primary dark:text-brand-primary dark:hover:bg-brand-primary dark:hover:text-white"
									>
										<Shield className="w-4 h-4 mr-1" />
										Admin
									</Button>
								</Link>
							)}
							<span className="text-sm text-gray-500 dark:text-gray-400">
								{adminName}
							</span>
							<Button
								variant="ghost"
								size="sm"
								className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
								onClick={() => setShowLogoutDialog(true)}
							>
								Đăng xuất
							</Button>
						</div>
					)}
				</nav>

				{/* Right side - Mobile */}
				<div className="flex items-center gap-2">
					{/* Dark Mode Toggle - Mobile */}
					<button
						onClick={toggleTheme}
						className="p-2 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
						aria-label="Toggle theme"
					>
						{isDark ? (
							<Sun className="w-5 h-5 text-yellow-400" />
						) : (
							<Moon className="w-5 h-5 text-gray-600" />
						)}
					</button>

					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					>
						{isMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Search */}
			<div className="px-4 pb-3 md:hidden">
				<form onSubmit={handleSearch} className="relative">
					<input
						type="text"
						placeholder="Tìm kiếm sản phẩm..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full px-4 py-2 pl-10 text-gray-900 bg-white border border-gray-200 rounded-full dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent"
					/>
					<Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
				</form>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className="bg-white border-t dark:bg-gray-900 dark:border-gray-700 md:hidden">
					<div className="flex flex-col gap-3 py-4 container-custom">
						<Link
							to="/"
							className="py-2 text-gray-600 transition dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Trang chủ
						</Link>
						<Link
							to="/san-pham"
							className="py-2 text-gray-600 transition dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Sản phẩm
						</Link>
						<Link
							to="/lien-he"
							className="py-2 text-gray-600 transition dark:text-gray-300 hover:text-brand-primary dark:hover:text-brand-primary"
							onClick={() => setIsMenuOpen(false)}
						>
							Liên hệ
						</Link>
						{isAdmin && (
							<div className="pt-3 mt-2 border-t dark:border-gray-700">
								{window.location.pathname === "/" ? (
									<button
										onClick={() => {
											navigate("/admin/dashboard");
											setIsMenuOpen(false);
										}}
										className="flex items-center gap-2 py-2 transition text-brand-primary hover:text-brand-accent"
									>
										<ArrowLeft className="w-5 h-5" />
										Quay lại Admin
									</button>
								) : (
									<Link
										to="/admin/dashboard"
										className="flex items-center gap-2 py-2 transition text-brand-primary hover:text-brand-accent"
										onClick={() => setIsMenuOpen(false)}
									>
										<Shield className="w-5 h-5" />
										Quản trị Admin
									</Link>
								)}
								<button
									onClick={() => {
										setIsMenuOpen(false);
										setShowLogoutDialog(true);
									}}
									className="py-2 text-left text-red-500 transition hover:text-red-600"
								>
									Đăng xuất
								</button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Dialog xác nhận đăng xuất */}
			<AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
				<AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700">
					<AlertDialogHeader>
						<AlertDialogTitle className="dark:text-white">
							Xác nhận đăng xuất
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700">
							Hủy
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleLogout}
							className="text-white bg-brand-primary hover:bg-brand-accent"
						>
							Đăng xuất
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</header>
	);
};

export default Header;
