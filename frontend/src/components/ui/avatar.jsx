import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border/50 after:mix-blend-darken",
        "size-10 data-[size=lg]:size-14 data-[size=sm]:size-8",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-brand-primary/10 text-sm font-medium text-brand-primary",
        "data-[size=sm]:text-xs data-[size=lg]:text-base",
        className
      )}
      {...props}
    />
  );
}

function AvatarBadge({
  className,
  ...props
}) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-brand-primary text-white ring-2 ring-background select-none",
        "data-[size=sm]:size-2.5 data-[size=sm]:[&>svg]:hidden",
        "data-[size=default]:size-3 data-[size=default]:[&>svg]:size-2",
        "data-[size=lg]:size-3.5 data-[size=lg]:[&>svg]:size-2.5",
        className
      )}
      {...props}
    />
  );
}

function AvatarGroup({
  className,
  ...props
}) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-medium text-brand-primary ring-2 ring-background",
        "size-10 group-has-data-[size=lg]/avatar-group:size-14 group-has-data-[size=sm]/avatar-group:size-8",
        "[&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
};