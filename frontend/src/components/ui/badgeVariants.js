import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white hover:bg-brand-accent",
        secondary: "bg-brand-secondary text-white hover:bg-pink-400",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
        ghost: "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20",
        success: "bg-green-500 text-white hover:bg-green-600",
        warning: "bg-yellow-500 text-white hover:bg-yellow-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);