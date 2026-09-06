"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Plus,
  NotebookTextIcon,
  User,
  Home,
  LogIn,
  Users,
  MessageCircleDashed,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Robust cross-platform virtual keyboard detection (Android, iOS Safari, PWA)
  useEffect(() => {
    const initialHeight = window.innerHeight;

    const isInputActive = () => {
      const activeEl = document.activeElement;
      if (!activeEl) return false;
      const tag = activeEl.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        (activeEl as HTMLElement).isContentEditable
      );
    };

    const updateKeyboardState = () => {
      // 1. If any input/textarea/select is currently active on mobile, keyboard is active
      if (isInputActive()) {
        setIsKeyboardOpen(true);
        return;
      }

      // 2. Check visualViewport height shrinkage (iOS Safari & Android Chrome)
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        if (heightDiff > 100) {
          setIsKeyboardOpen(true);
          return;
        }
      }

      // 3. Check window height shrinkage (Android default)
      if (initialHeight - window.innerHeight > 100) {
        setIsKeyboardOpen(true);
        return;
      }

      setIsKeyboardOpen(false);
    };

    // Listen to visualViewport resize & scroll
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateKeyboardState);
    }
    window.addEventListener("resize", updateKeyboardState);
    window.addEventListener("focusin", updateKeyboardState);
    window.addEventListener("focusout", () => {
      // Delay to let focus transfer between fields without flashing
      setTimeout(updateKeyboardState, 150);
    });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateKeyboardState);
      }
      window.removeEventListener("resize", updateKeyboardState);
      window.removeEventListener("focusin", updateKeyboardState);
    };
  }, []);

  // Prevent flicker during initial session resolution
  if (isPending) return null;

  // When mobile virtual keyboard is open, completely hide the bottom nav
  // so it never floats above the keyboard or blocks inputs/buttons
  if (isKeyboardOpen) return null;

  // 1. Guest Bottom Navigation
  if (!session) {
    const guestTabs = [
      { name: "Home", href: "/", icon: Home, exact: true },
      { name: "About", href: "/about", icon: Users, exact: false },
      { name: "Contact", href: "/contact-us", icon: MessageCircleDashed, exact: false },
      { name: "Login", href: "/login", icon: LogIn, exact: false },
    ];

    return (
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/60 bg-background/90 backdrop-blur-xl supports-backdrop-filter:bg-background/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 h-16 max-w-md mx-auto items-center px-1">
          {guestTabs.map((tab) => {
            const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
            const Icon = tab.icon;

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-95",
                  active
                    ? "text-primary font-semibold"
                    : "text-muted-foreground/75 hover:text-foreground font-medium"
                )}
              >
                {active && (
                  <span className="absolute top-1 h-0.5 w-6 rounded-full bg-primary" />
                )}
                <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
                <span className="text-[10px] tracking-tight mt-1">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // 2. Authenticated Tabs: Dashboard, Mill-Data, Add Ledger (Center), Ledger, Profile
  const isDashboardActive = pathname === "/dashboard";
  const isMillDataActive = pathname.startsWith("/mill-data");
  const isAddLedgerActive = pathname === "/grinding-ledger/new";
  const isLedgerActive = pathname === "/grinding-ledger";
  const isProfileActive = pathname.startsWith("/profile");

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/60 bg-background/90 backdrop-blur-xl supports-backdrop-filter:bg-background/80 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.35)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1">
        {/* Tab 1: Dashboard */}
        <Link
          href="/dashboard"
          className={cn(
            "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-95",
            isDashboardActive
              ? "text-primary font-semibold"
              : "text-muted-foreground/75 hover:text-foreground font-medium"
          )}
        >
          {isDashboardActive && (
            <span className="absolute top-1 h-0.5 w-6 rounded-full bg-primary" />
          )}
          <LayoutDashboard className={cn("h-5 w-5 transition-transform", isDashboardActive && "scale-110")} />
          <span className="text-[10px] sm:text-[11px] tracking-tight mt-1">Dashboard</span>
        </Link>

        {/* Tab 2: Mill Data */}
        <Link
          href="/mill-data"
          className={cn(
            "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-95",
            isMillDataActive
              ? "text-primary font-semibold"
              : "text-muted-foreground/75 hover:text-foreground font-medium"
          )}
        >
          {isMillDataActive && (
            <span className="absolute top-1 h-0.5 w-6 rounded-full bg-primary" />
          )}
          <Database className={cn("h-5 w-5 transition-transform", isMillDataActive && "scale-110")} />
          <span className="text-[10px] sm:text-[11px] tracking-tight mt-1">Mill Data</span>
        </Link>

        {/* Tab 3: Center Elevated Action Button - Add New Ledger */}
        <Link
          href="/grinding-ledger/new"
          className="flex-1 flex flex-col items-center justify-center relative -mt-3 group"
          aria-label="Add New Ledger"
        >
          <div
            className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 active:scale-90 border-2 border-background",
              isAddLedgerActive
                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background shadow-primary/30"
                : "bg-primary text-primary-foreground shadow-primary/25 group-hover:scale-105"
            )}
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span
            className={cn(
              "text-[10px] sm:text-[11px] tracking-tight mt-1",
              isAddLedgerActive
                ? "text-primary font-semibold"
                : "text-muted-foreground/75 font-medium"
            )}
          >
            Add Ledger
          </span>
        </Link>

        {/* Tab 4: Ledger Page */}
        <Link
          href="/grinding-ledger"
          className={cn(
            "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-95",
            isLedgerActive
              ? "text-primary font-semibold"
              : "text-muted-foreground/75 hover:text-foreground font-medium"
          )}
        >
          {isLedgerActive && (
            <span className="absolute top-1 h-0.5 w-6 rounded-full bg-primary" />
          )}
          <NotebookTextIcon className={cn("h-5 w-5 transition-transform", isLedgerActive && "scale-110")} />
          <span className="text-[10px] sm:text-[11px] tracking-tight mt-1">Ledger</span>
        </Link>

        {/* Tab 5: Profile */}
        <Link
          href="/profile"
          className={cn(
            "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-95",
            isProfileActive
              ? "text-primary font-semibold"
              : "text-muted-foreground/75 hover:text-foreground font-medium"
          )}
        >
          {isProfileActive && (
            <span className="absolute top-1 h-0.5 w-6 rounded-full bg-primary" />
          )}
          <User className={cn("h-5 w-5 transition-transform", isProfileActive && "scale-110")} />
          <span className="text-[10px] sm:text-[11px] tracking-tight mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
