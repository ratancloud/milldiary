"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  LayoutDashboard,
  Users,
  ChevronRight,
  Home,
  MessageCircleDashed,
  NotebookTextIcon,
  Database,
  PlusSquare,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { Button } from "@/components/ui/button";
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
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = session
    ? [
      { name: "Home", href: "/", icon: Home },
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "MillData", href: "/mill-data", icon: Database },
      { name: "Ledger", href: "/grinding-ledger", icon: NotebookTextIcon },
      { name: "InsertData", href: "/mill-data/create", icon: PlusSquare },
      { name: "About", href: "/about", icon: Users },
      { name: "Contact Us", href: "/contact-us", icon: MessageCircleDashed },
    ]
    : [
      { name: "Home", href: "/", icon: Home },
      { name: "About", href: "/about", icon: Users },
      { name: "Contact Us", href: "/contact-us", icon: MessageCircleDashed },
    ];

  const handleLogout = async () => {
    setMobileOpen(false);
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky flex items-center justify-center top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* --- LEFT: LOGO --- */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
              <NotebookTextIcon className="h-5 w-5" />
            </div>
            <span className="text-2xl">Mill Diary</span>
          </Link>
        </div>

        {/* Middel: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`
                  px-3 py-2 text-sm tracking-wider rounded-md font-medium transition-all duration-200
                  ${isActive(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                }
                `}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden shrink-0 bg-muted hover:bg-primary/20"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[65vw] sm:w-87.5 flex flex-col p-0"
            >
              <SheetHeader className="border-b">
                <SheetTitle className="flex items-center gap-2 text-2xl">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <NotebookTextIcon className="h-5 w-5" />
                  </div>
                  Mill Diary
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`
                              flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                              ${isActive(link.href)
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                          }
                            `}
                      >
                        <Icon className="h-4 w-4" />
                        {link.name}
                        {isActive(link.href) && (
                          <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-auto border-t p-6 bg-muted/10">
                {isPending ? (
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-25" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ) : session ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 bg-muted hover:bg-muted/50 border p-2 rounded-lg shadow-sm"
                    >
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback>
                          {session.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </Link>
                    <Button
                      className="w-full justify-start shadow-sm bg-primary hover:bg-primary/90"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="w-full justify-center"
                      asChild
                    >
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button className="w-full justify-center" asChild>
                      <Link href="/signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop User Menu (Dynamic) - Now Last in DOM */}
          <div className="hidden md:flex items-center gap-2">
            {isPending ? (
              <Skeleton className="h-9 w-9 rounded-full bg-primary/30" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-offset-background hover:bg-muted"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={session.user.image || ""}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-muted font-medium">
                        {session.user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col justify-center items-start space-y-1">
                      <p className="text-sm font-medium leading-none truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate py-1">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => setMobileOpen(false)}
                      className="focus:bg-primary/20"
                      asChild
                    >
                      <Link href="/profile" className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-primary focus:bg-primary/20 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild>
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
