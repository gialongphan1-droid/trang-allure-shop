import { cn } from "@/lib/utils"
import { badgeVariants } from "./badgeVariants"

function Badge({
  className,
  variant = "default",
  ...props
}) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge }