"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionProps {
  title: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({
  title,
  icon: Icon,
  badge,
  children,
  className,
}: SectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between border-b border-border/70 dark:border-white/10 pb-2.5">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-wider uppercase">
            {title}
          </h3>
        </div>
        {badge && <div>{badge}</div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {children}
      </div>
    </div>
  );
}