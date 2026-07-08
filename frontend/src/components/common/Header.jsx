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
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, LogOut, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const checkAuth = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await adminApi.getMe();
      if (response?.success && response?.data) {
        setIsAdmin(true);
      } else {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === "adminToken") {
        checkAuth();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminLoginPage = location.pathname === "/admin/login";

  const getPreviousAdminPage = () => {
    if (isAdminPage && !isAdminLoginPage) {
      sessionStorage.setItem("lastAdminPage", location.pathname);
    }
    return sessionStorage.getItem("lastAdminPage") || "/admin/dashboard";
  };

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
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      setShowLogoutDialog(false);
      setIsAdmin(false);
      navigate("/admin/login", { replace: true });
    }
  };

  const handleBackToAdmin = () => {
    const lastPage = getPreviousAdminPage();
    navigate(lastPage);
  };

  const showAdminButtons = isAdmin && !isLoading;

  return (
    <>
      <header className="sticky top-0 z-50 w-full transition-colors bg-white border-b">
        <div className="py-3 container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-brand-primary"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-gray-900 font-display">TrangAllure</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden space-x-6 md:flex">
              <Link
                to="/"
                className="text-gray-700 transition hover:text-brand-primary"
              >
                Trang chủ
              </Link>
              <Link
                to="/san-pham"
                className="text-gray-700 transition hover:text-brand-primary"
              >
                Sản phẩm
              </Link>
              <Link
                to="/lien-he"
                className="text-gray-700 transition hover:text-brand-primary"
              >
                Liên hệ
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {showAdminButtons && !isAdminLoginPage && (
                <>
                  {!isAdminPage && (
                    <button
                      onClick={handleBackToAdmin}
                      className="flex items-center gap-1 px-3 py-2 text-sm font-medium transition rounded-lg text-brand-primary hover:bg-brand-primary/10"
                      aria-label="Quay lại trang admin"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 transition rounded-lg hover:bg-red-50"
                    aria-label="Đăng xuất"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Đăng xuất</span>
                  </button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg md:hidden hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="flex flex-col gap-4 pt-4 pb-2 md:hidden">
              <Link
                to="/"
                className="text-gray-700 transition hover:text-brand-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/san-pham"
                className="text-gray-700 transition hover:text-brand-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                to="/lien-he"
                className="text-gray-700 transition hover:text-brand-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Liên hệ
              </Link>
              {showAdminButtons && !isAdminLoginPage && (
                <>
                  {!isAdminPage && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleBackToAdmin();
                      }}
                      className="flex items-center gap-2 text-left text-brand-primary hover:text-brand-accent"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Quay lại Admin
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setShowLogoutDialog(true);
                    }}
                    className="flex items-center gap-2 text-left text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

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
              className="text-white bg-red-600 hover:bg-red-700"
            >
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Header;