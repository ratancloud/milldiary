"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  ChevronRight,
  NotebookTextIcon,
  Database,
  PlusSquare,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isHeroPage = pathname === "/" || pathname === "/about" || pathname === "/contact-us";

  // Transparent when at the top (original place) showing hero background,
  // backdrop-blur like original nav when scrolled any number of pixels (> 0)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dedicated product links only — Home, About, and Contact are removed
  const navLinks = session
    ? [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Mill Data", href: "/mill-data", icon: Database },
      { name: "Grinding Ledger", href: "/grinding-ledger", icon: NotebookTextIcon },
      { name: "New Ledger", href: "/grinding-ledger/new", icon: PlusSquare },
      { name: "Insert Data", href: "/mill-data/create", icon: PlusSquare },
    ]
    : [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Mill Data", href: "/mill-data", icon: Database },
      { name: "Grinding Ledger", href: "/grinding-ledger", icon: NotebookTextIcon },
    ];

  const handleLogout = async () => {
    setMobileOpen(false);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href;
  };

  return (
    <header
      className={cn(
        "top-0 z-50 w-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isHeroPage ? "fixed left-0 right-0" : "sticky",
        isScrolled
          ? "border-b border-border/40 bg-background/85 dark:bg-[#141516]/85 backdrop-blur-md supports-backdrop-filter:bg-background/60 shadow-xs h-16"
          : isHeroPage
            ? "border-b border-transparent bg-transparent shadow-none backdrop-blur-none h-16"
            : "border-b border-border/40 bg-background/85 dark:bg-[#141516]/85 backdrop-blur-md supports-backdrop-filter:bg-background/60 shadow-xs h-16"
      )}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center gap-6">
          <Logo size="default" />
        </div>

        {/* --- MIDDLE: DESKTOP PRODUCT NAVIGATION (NO HOME/ABOUT/CONTACT) --- */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-secondary/50 border border-border/40 backdrop-blur-md">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer select-none",
                  active
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* --- RIGHT: ACTIONS & USER PROFILE --- */}
        <div className="flex items-center gap-2.5">
          <ModeToggle />

          {/* Mobile Sidebar Hamburger Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden shrink-0 border-border/70 bg-card/80 shadow-2xs hover:bg-secondary"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* --- MODERN REDESIGNED SIDEBAR --- */}
            <SheetContent
              side="left"
              className="w-[75vw] sm:w-80 flex flex-col p-0 border-r border-border/80 bg-card"
            >
              {/* Sidebar Header */}
              <SheetHeader className="border-b border-border/70 p-5 text-left bg-secondary/20">
                <SheetTitle asChild className="p-0">
                  <div className="flex items-center">
                    <Logo size="default" showTagline asLink={false} />
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Sidebar Product Nav Links */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  Mill Applications
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150 active:scale-[0.98]",
                          active
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <Icon className={cn("h-4 w-4", active ? "text-primary-foreground" : "text-primary")} />
                        <span>{link.name}</span>
                        {active && (
                          <ChevronRight className="ml-auto h-4 w-4 opacity-70" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Footer User / Auth Strip */}
              <div className="mt-auto border-t border-border/70 p-4 bg-secondary/20 space-y-2">
                {isPending ? (
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ) : session ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg bg-card border border-border/70 hover:bg-secondary transition-colors"
                    >
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="font-semibold text-primary">
                          {session.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-xs font-bold text-foreground truncate">
                          {session.user.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs border-border/80"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-3.5 w-3.5" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-xs"
                      asChild
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/login">
                        <LogIn className="mr-2 h-3.5 w-3.5" />
                        Log in
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="w-full justify-center text-xs"
                      asChild
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/signup">
                        <UserPlus className="mr-2 h-3.5 w-3.5" />
                        Create Account
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop User Menu Dropdown */}
          <div className="hidden md:flex items-center gap-2">
            {isPending ? (
              <Skeleton className="h-9 w-9 rounded-full bg-primary/20" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0 border border-border/70 hover:ring-2 hover:ring-primary/40 cursor-pointer"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session.user.image || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="font-semibold text-primary text-xs">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="w-full cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:bg-destructive/10 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs font-semibold" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" className="text-xs font-semibold shadow-xs" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
