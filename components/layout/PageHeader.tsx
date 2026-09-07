"use client";

import React from "react";
import Link from "next/link";
import { Home, LucideIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export interface BreadcrumbCrumb {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export interface PageHeaderProps {
  items: BreadcrumbCrumb[];
  actions?: React.ReactNode;
  className?: string;
  // Deprecated/optional props accepted for backwards compatibility without rendering
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  badge?: string | React.ReactNode;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "accent";
  backHref?: string;
  onBack?: () => void;
}

/**
 * PageHeader: Production-grade page header conforming strictly to the Copper Slate design system.
 * Uses uniform corner radii (rounded-xl) matching all cards, panels, and controls.
 * Renders left-aligned breadcrumb trail and right-aligned action controls without odd pills,
 * back buttons, or descriptive badge clutter.
 */
export function PageHeader({
  items,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 w-full",
        className
      )}
    >
      {/* Left: Design System Breadcrumb Container (matching action button height h-9 sm:h-10 & typography) */}
      <Breadcrumb className="shrink-0 max-w-full overflow-x-auto no-scrollbar">
        <BreadcrumbList className="inline-flex items-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl border border-border/80 dark:border-white/[0.08] bg-secondary/40 dark:bg-secondary/25 backdrop-blur-sm text-xs font-semibold shadow-xs select-none">
          {/* Root Home Link */}
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:no-underline font-medium text-xs transition-colors"
              aria-label="Home"
            >
              <Home className="h-3.5 w-3.5" />
            </BreadcrumbLink>
          </BreadcrumbItem>

          {items.map((crumb, idx) => {
            const isLast = idx === items.length - 1;
            const Icon = crumb.icon;

            return (
              <React.Fragment key={`${crumb.label}-${idx}`}>
                <BreadcrumbSeparator className="[&>svg]:w-3.5 [&>svg]:h-3.5 text-muted-foreground/45 mx-0.5" />
                <BreadcrumbItem>
                  {isLast || !crumb.href ? (
                    <BreadcrumbPage className="flex items-center gap-1.5 text-primary font-semibold text-xs tracking-tight">
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      {Icon && <Icon className="h-3.5 w-3.5 text-primary" />}
                      <span>{crumb.label}</span>
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={crumb.href}
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground hover:no-underline font-medium text-xs transition-colors"
                    >
                      {Icon && <Icon className="h-3.5 w-3.5 opacity-70" />}
                      <span>{crumb.label}</span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right: Actions Toolbar */}
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
