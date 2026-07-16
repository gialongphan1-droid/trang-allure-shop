import { Tabs as TabsPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { tabsListVariants } from "./tabsVariants";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex gap-2 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  variant = "default",
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-[orientation=vertical]:px-3",
        "data-[state=active]:bg-white data-[state=active]:text-brand-text data-[state=active]:shadow-sm",
        "group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:text-brand-primary",
        "group-data-[variant=line]/tabs-list:after:absolute group-data-[variant=line]/tabs-list:after:bg-brand-primary group-data-[variant=line]/tabs-list:after:opacity-0 group-data-[variant=line]/tabs-list:after:transition-opacity",
        "group-data-[variant=line]/tabs-list:data-[orientation=horizontal]:after:inset-x-0 group-data-[variant=line]/tabs-list:data-[orientation=horizontal]:after:bottom-0 group-data-[variant=line]/tabs-list:data-[orientation=horizontal]:after:h-0.5",
        "group-data-[variant=line]/tabs-list:data-[orientation=vertical]:after:inset-y-0 group-data-[variant=line]/tabs-list:data-[orientation=vertical]:after:-right-0 group-data-[variant=line]/tabs-list:data-[orientation=vertical]:after:w-0.5",
        "group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100",
        "group-data-[variant=pill]/tabs-list:data-[state=active]:bg-brand-primary group-data-[variant=pill]/tabs-list:data-[state=active]:text-white",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 text-sm outline-none",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };