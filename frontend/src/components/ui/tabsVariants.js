import { cva } from "class-variance-authority";

export const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-xl p-1 text-muted-foreground data-[orientation=horizontal]:h-10 data-[orientation=vertical]:h-fit data-[orientation=vertical]:flex-col data-[orientation=vertical]:p-1",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
        pill: "bg-brand-primary/10 gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);