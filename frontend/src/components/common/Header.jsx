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
      <header className="sticky top-0 z-50 w-full bg-white border-b border-border transition-colors">
        <div className="w-full px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold transition-colors hover:opacity-80"
            >
              <ShoppingBag className="w-6 h-6 text-brand-primary" />
              <span className="font-display text-brand-text">TrangAllure</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden space-x-6 md:flex">
              <Link
                to="/"
                className="text-muted-foreground transition-colors hover:text-brand-primary font-medium"
              >
                Trang chủ
              </Link>
              <Link
                to="/san-pham"
                className="text-muted-foreground transition-colors hover:text-brand-primary font-medium"
              >
                Sản phẩm
              </Link>
              <Link
                to="/lien-he"
                className="text-muted-foreground transition-colors hover:text-brand-primary font-medium"
              >
                Liên hệ
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {showAdminButtons && !isAdminLoginPage && (
                <>
                  {!isAdminPage && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleBackToAdmin}
                      className="gap-1 text-brand-primary hover:bg-brand-primary/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLogoutDialog(true)}
                    className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Đăng xuất</span>
                  </Button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="flex flex-col gap-3 pt-4 pb-2 border-t border-border mt-3 md:hidden">
              <Link
                to="/"
                className="text-muted-foreground transition-colors hover:text-brand-primary font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                to="/san-pham"
                className="text-muted-foreground transition-colors hover:text-brand-primary font-medium py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Sản phẩm
              </Link>
              <Link
                to="/lien-he"
                className="text-muted-foreground transition-colors hover:text-brand-primary font-medium py-1"
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
                      className="flex items-center gap-2 py-1 text-left text-brand-primary hover:text-brand-accent font-medium"
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
                    className="flex items-center gap-2 py-1 text-left text-red-600 hover:text-red-700 font-medium"
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
            <AlertDialogTitle className="font-display text-brand-text">
              Xác nhận đăng xuất
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản admin?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-500 text-white hover:bg-red-600"
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