"use client";

import React from "react";
import { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface NumberInputProps {
  label: string;
  error?: FieldError;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function NumberInput({
  label,
  error,
  hint,
  className,
  children,
}: NumberInputProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          {label}
        </label>
        {hint && (
          <span className="text-[11px] text-muted-foreground/80 font-normal">
            {hint}
          </span>
        )}
      </div>
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive mt-1">
          {error.message}
        </p>
      )}
    </div>
  );
}
