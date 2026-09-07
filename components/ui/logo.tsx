"use client";

import React, { useId } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LogoProps {
  size?: "sm" | "default" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  asLink?: boolean;
  href?: string;
}

const SIZE_CONFIGS = {
  sm: {
    boxSize: "h-7 w-7",
    textClass: "text-lg",
    taglineClass: "text-[8px]",
    dotSize: "h-1 w-1",
    gap: "gap-2",
  },
  default: {
    boxSize: "h-8.5 w-8.5 sm:h-9 sm:w-9",
    textClass: "text-xl sm:text-2xl",
    taglineClass: "text-[9px]",
    dotSize: "h-1.5 w-1.5",
    gap: "gap-2.5",
  },
  lg: {
    boxSize: "h-11 w-11 sm:h-12 sm:w-12",
    textClass: "text-2xl sm:text-3xl",
    taglineClass: "text-[10px]",
    dotSize: "h-2 w-2",
    gap: "gap-3",
  },
  xl: {
    boxSize: "h-14 w-14 sm:h-16 sm:w-16",
    textClass: "text-3xl sm:text-4xl",
    taglineClass: "text-xs",
    dotSize: "h-2.5 w-2.5",
    gap: "gap-3.5",
  },
};

/**
 * MillDiaryMark: Bespoke Brandmark Symbol for Mill Diary.
 * 
 * Symbolism:
 * 1. Geometric "M" monogram.
 * 2. Open ledger folio pages (Diary / Accounting / Milling Slips).
 * 3. Central millstone grinding hub & golden grain seed apex (Mill & Agriculture).
 * 4. Rich Copper Slate gradient container with ambient specular sheen.
 */
export function MillDiaryMark({
  className,
}: {
  className?: string;
}) {
  const rawId = useId();
  const safeId = rawId.replace(/:/g, "_");
  const shieldGradId = `mdShield_${safeId}`;
  const sheenGradId = `mdSheen_${safeId}`;
  const kernelGradId = `mdKernel_${safeId}`;

  return (
    <div
      className={cn(
        "relative flex items-center justify-center shrink-0 select-none group transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(166,83,46,0.32)] dark:drop-shadow-[0_2px_12px_rgba(214,135,95,0.28)]"
      >
        <defs>
          {/* Rich Multi-Stop Copper Gradient */}
          <linearGradient id={shieldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c26338" />
            <stop offset="45%" stopColor="#a6532e" />
            <stop offset="100%" stopColor="#6e2d12" />
          </linearGradient>

          {/* Optical Top Specular Sheen */}
          <linearGradient id={sheenGradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.32" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Golden Wheat Seed / Kernel Glow */}
          <linearGradient id={kernelGradId} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#ffd8b3" />
          </linearGradient>
        </defs>

        {/* Squircle Brand Canvas */}
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="9"
          fill={`url(#${shieldGradId})`}
        />

        {/* Ambient Top Highlight */}
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="9"
          fill={`url(#${sheenGradId})`}
        />

        {/* Hairline Glass Bevel Border */}
        <rect
          x="1.5"
          y="1.5"
          width="33"
          height="33"
          rx="8.5"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />

        {/* Architectural "M" & Open Ledger Pages */}
        {/* Left Folio Leaf & Outer Arch */}
        <path
          d="M9 25.5V14.2C9 12.3 10.3 11 12.2 11H12.8C14.2 11 15.6 11.9 16.4 13.2L18 15.6"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right Folio Leaf & Outer Arch */}
        <path
          d="M27 25.5V14.2C27 12.3 25.7 11 23.8 11H23.2C21.8 11 20.4 11.9 19.6 13.2L18 15.6"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Ledger Spine / Milling Hub Axis */}
        <path
          d="M18 15.6V25.5"
          stroke="#ffffff"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Golden Wheat Grain / Precision Diamond Apex */}
        <path
          d="M18 7.2L20.5 11.2L18 15.2L15.5 11.2Z"
          fill={`url(#${kernelGradId})`}
        />

        {/* Left Page Ledger Lines */}
        <line
          x1="12"
          y1="18"
          x2="14.8"
          y2="18"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="12"
          y1="21.5"
          x2="14.8"
          y2="21.5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Right Page Ledger Lines */}
        <line
          x1="21.2"
          y1="18"
          x2="24"
          y2="18"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="21.2"
          y1="21.5"
          x2="24"
          y2="21.5"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

/**
 * Logo: Complete brand lockup (Brandmark + Typographic Wordmark)
 */
export function Logo({
  size = "default",
  showText = true,
  showTagline = false,
  className,
  iconClassName,
  textClassName,
  asLink = true,
  href = "/",
}: LogoProps) {
  const config = SIZE_CONFIGS[size];

  const content = (
    <div
      className={cn(
        "inline-flex items-center select-none cursor-pointer group transition-opacity hover:opacity-95",
        config.gap,
        className
      )}
    >
      {/* Brandmark Icon */}
      <MillDiaryMark className={cn(config.boxSize, iconClassName)} />

      {/* Typographic Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div
            className={cn(
              "font-extrabold tracking-tight flex items-baseline gap-1 font-sans",
              config.textClass,
              textClassName
            )}
          >
            <span className="text-foreground tracking-tight font-extrabold">Mill</span>
            <span className="text-primary tracking-tight font-black">
              Diary
            </span>
            <span
              className={cn(
                "rounded-full bg-primary inline-block transition-transform duration-200 group-hover:scale-125",
                config.dotSize
              )}
            />
          </div>

          {showTagline && (
            <span
              className={cn(
                "uppercase font-mono tracking-widest text-muted-foreground font-semibold mt-0.5",
                config.taglineClass
              )}
            >
              Operating System
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} aria-label="Mill Diary Home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
