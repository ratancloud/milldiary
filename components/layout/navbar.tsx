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
  Home,
  MessageCircle,
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
      { name: "Home", href: "/", icon: Home },
      { name: "About", href: "/about", icon: User },
      { name: "Contact us", href: "/contact-us", icon: MessageCircle },
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
        "top-0 z-50 w-full flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pt-[env(safe-area-inset-top)]",
        isHeroPage ? "fixed left-0 right-0" : "sticky",
        isScrolled
          ? "border-b border-border/40 bg-background/85 dark:bg-[#141516]/85 backdrop-blur-md supports-backdrop-filter:bg-background/60 shadow-xs"
          : isHeroPage
            ? "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
            : "border-b border-border/40 bg-background/85 dark:bg-[#141516]/85 backdrop-blur-md supports-backdrop-filter:bg-background/60 shadow-xs"
      )}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

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
              className="w-[82vw] max-w-80 sm:w-80 flex flex-col p-0 border-r border-border/80 bg-card shadow-2xl backdrop-blur-xl"
            >
              {/* Sidebar Header */}
              <SheetHeader className="border-b border-border/70 px-5 py-4.5 text-left bg-secondary/15">
                <SheetTitle asChild className="p-0">
                  <div className="flex items-center">
                    <Logo size="default" showTagline asLink={false} />
                  </div>
                </SheetTitle>
              </SheetHeader>

              {/* Sidebar Product Nav Links */}
              <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
                <div>
                  <div className="px-3 pb-2 text-[10px] uppercase font-mono tracking-wider font-semibold text-muted-foreground/80">
                    Menu Navigation
                  </div>
                  <nav className="flex flex-col gap-1.5">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
                            active
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                          )}
                        >
                          <div
                            className={cn(
                              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                              active
                                ? "bg-white/20 text-primary-foreground"
                                : "bg-secondary/60 text-primary group-hover:bg-primary/10"
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                          </div>
                          <span className="truncate">{link.name}</span>
                          {active && (
                            <div className="ml-auto flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                              <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                            </div>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Sidebar Footer User / Auth Strip */}
              <div className="mt-auto border-t border-border/70 p-4 bg-secondary/15 space-y-3">
                {isPending ? (
                  <div className="flex items-center gap-3 p-2">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ) : session ? (
                  <div className="space-y-2.5">
                    <Button
                      variant="outline"
                      className="w-full h-10 rounded-xl text-xs font-bold border-border/80 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-3.5 w-3.5 shrink-0" />
                      <span>Log out</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      className="w-full h-10 rounded-xl text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
                      asChild
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/login">
                        <LogIn className="h-3.5 w-3.5 shrink-0" />
                        <span>Log in</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-10 rounded-xl text-xs font-bold border-border/80 hover:bg-secondary/70 text-foreground flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
                      asChild
                      onClick={() => setMobileOpen(false)}
                    >
                      <Link href="/signup">
                        <UserPlus className="h-3.5 w-3.5 shrink-0" />
                        <span>Sign up</span>
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
