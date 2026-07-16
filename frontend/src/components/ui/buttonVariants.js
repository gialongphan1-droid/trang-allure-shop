import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-brand-primary text-white shadow-md hover:bg-brand-accent hover:shadow-lg",
        secondary: "bg-brand-secondary text-white shadow-md hover:bg-pink-400 hover:shadow-lg",
        outline: "border-2 border-brand-primary bg-transparent text-brand-primary hover:bg-brand-primary hover:text-white",
        ghost: "text-brand-primary hover:bg-brand-primary/10",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
        link: "text-brand-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3 py-1.5 text-xs",
        lg: "h-12 px-8 py-3 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);