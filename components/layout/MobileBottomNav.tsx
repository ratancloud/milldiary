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
  LogIn,
  Sparkles,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Virtual keyboard detection to hide nav when typing
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
      if (isInputActive()) {
        setIsKeyboardOpen(true);
        return;
      }
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        if (heightDiff > 100) {
          setIsKeyboardOpen(true);
          return;
        }
      }
      if (initialHeight - window.innerHeight > 100) {
        setIsKeyboardOpen(true);
        return;
      }
      setIsKeyboardOpen(false);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateKeyboardState);
    }
    window.addEventListener("resize", updateKeyboardState);
    window.addEventListener("focusin", updateKeyboardState);
    window.addEventListener("focusout", () => {
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

  if (isPending || isKeyboardOpen) return null;

  // Active route helpers
  const isDashboardActive = pathname === "/dashboard";
  const isMillDataActive = pathname.startsWith("/mill-data");
  const isAddLedgerActive = pathname === "/grinding-ledger/new";
  const isLedgerActive = pathname === "/grinding-ledger";
  const isProfileActive = pathname.startsWith("/profile");
  const isLoginActive = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-border/80 bg-background/92 dark:bg-[#141516]/95 backdrop-blur-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.45)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        
        {/* Tab 1: Dashboard */}
        <Link
          href="/dashboard"
          className={cn(
            "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-[0.92] select-none",
            isDashboardActive
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isDashboardActive && (
            <span className="absolute top-1.5 h-1 w-6 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          )}
          <LayoutDashboard className={cn("h-5 w-5 transition-transform", isDashboardActive && "scale-110")} />
          <span className="text-[10px] tracking-tight mt-1">Dashboard</span>
        </Link>

        {/* Tab 2: Mill Data */}
        <Link
          href="/mill-data"
          className={cn(
            "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-[0.92] select-none",
            isMillDataActive
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isMillDataActive && (
            <span className="absolute top-1.5 h-1 w-6 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          )}
          <Database className={cn("h-5 w-5 transition-transform", isMillDataActive && "scale-110")} />
          <span className="text-[10px] tracking-tight mt-1">Mill Data</span>
        </Link>

        {/* Tab 3: Center Elevated Action Button (Add Ledger / Launch) */}
        <Link
          href={session ? "/grinding-ledger/new" : "/signup"}
          className="flex-1 flex flex-col items-center justify-center relative -mt-3.5 group select-none cursor-pointer"
          aria-label={session ? "Add New Grinding Slip" : "Get Started"}
        >
          <div
            className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center shadow-[0_4px_18px_rgba(166,83,46,0.38)] dark:shadow-[0_4px_20px_rgba(214,135,95,0.32)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 border-2 border-background",
              isAddLedgerActive
                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                : "bg-primary text-primary-foreground group-hover:scale-105"
            )}
          >
            {session ? (
              <Plus className="h-6 w-6 stroke-[2.5]" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>
          <span
            className={cn(
              "text-[10px] tracking-tight mt-1 font-semibold",
              isAddLedgerActive ? "text-primary" : "text-foreground"
            )}
          >
            {session ? "Add Slip" : "Start"}
          </span>
        </Link>

        {/* Tab 4: Grinding Ledger */}
        <Link
          href="/grinding-ledger"
          className={cn(
            "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-[0.92] select-none",
            isLedgerActive
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-foreground font-medium"
          )}
        >
          {isLedgerActive && (
            <span className="absolute top-1.5 h-1 w-6 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
          )}
          <NotebookTextIcon className={cn("h-5 w-5 transition-transform", isLedgerActive && "scale-110")} />
          <span className="text-[10px] tracking-tight mt-1">Ledger</span>
        </Link>

        {/* Tab 5: Profile or Login */}
        {session ? (
          <Link
            href="/profile"
            className={cn(
              "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-[0.92] select-none",
              isProfileActive
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground font-medium"
            )}
          >
            {isProfileActive && (
              <span className="absolute top-1.5 h-1 w-6 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            )}
            <User className={cn("h-5 w-5 transition-transform", isProfileActive && "scale-110")} />
            <span className="text-[10px] tracking-tight mt-1">Profile</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className={cn(
              "flex-1 flex flex-col items-center justify-center h-full py-1 relative transition-all active:scale-[0.92] select-none",
              isLoginActive
                ? "text-primary font-bold"
                : "text-muted-foreground hover:text-foreground font-medium"
            )}
          >
            {isLoginActive && (
              <span className="absolute top-1.5 h-1 w-6 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            )}
            <LogIn className={cn("h-5 w-5 transition-transform", isLoginActive && "scale-110")} />
            <span className="text-[10px] tracking-tight mt-1">Login</span>
          </Link>
        )}

      </div>
    </nav>
  );
}
