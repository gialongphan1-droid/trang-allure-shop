import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./buttonVariants";

/**
 * Button component với các biến thể:
 * - default: Primary (mint)
 * - secondary: Secondary (hồng sen)
 * - outline: Viền mint
 * - ghost: Nền trong suốt
 * - destructive: Đỏ (xóa)
 * - link: Giống link
 * - success: Xanh lá (thành công)
 * - warning: Vàng (cảnh báo)
 * 
 * Kích thước:
 * - sm: Nhỏ
 * - default: Vừa
 * - lg: Lớn
 * - icon: Hình vuông (vừa)
 * - icon-sm: Hình vuông (nhỏ)
 * - icon-lg: Hình vuông (lớn)
 */
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

Button.displayName = "Button";

export { Button };