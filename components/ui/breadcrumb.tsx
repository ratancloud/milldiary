import * as React from "react";
import Link from "next/link";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-xs text-muted-foreground sm:gap-2 select-none",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  href,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  if (asChild) {
    return (
      <Slot
        data-slot="breadcrumb-link"
        className={cn(
          "transition-colors hover:text-foreground inline-flex items-center gap-1 cursor-pointer font-medium",
          className
        )}
        {...props}
      />
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        data-slot="breadcrumb-link"
        className={cn(
          "transition-colors hover:text-foreground inline-flex items-center gap-1 cursor-pointer font-medium hover:underline underline-offset-4 decoration-primary/40",
          className
        )}
        {...(props as any)}
      />
    );
  }

  return (
    <a
      data-slot="breadcrumb-link"
      className={cn(
        "transition-colors hover:text-foreground inline-flex items-center gap-1 cursor-pointer font-medium",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-semibold text-foreground tracking-tight", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "[&>svg]:w-3.5 [&>svg]:h-3.5 text-muted-foreground/45 flex items-center",
        className
      )}
      {...props}
    >
      {children ?? <ChevronRight className="h-3.5 w-3.5" />}
    </li>
  );
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-6 w-6 items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <MoreHorizontal className="h-3.5 w-3.5" />
      <span className="sr-only">More</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
