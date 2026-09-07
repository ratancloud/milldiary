"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TextareaBlockProps {
  label: string;
  className?: string;
  children: React.ReactNode;
}

export function TextareaBlock({
  label,
  className,
  children,
}: TextareaBlockProps) {
  return (
    <div className={cn("space-y-1.5 md:col-span-2", className)}>
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
        {label}
      </label>
      {children}
    </div>
  );
}
