
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  UserCircle,
  Clapperboard,
  Shield,
  Menu,
  LucideIcon,
  MessageSquare,
  LogOut,
  LogIn,
  Settings,
  Gift,
} from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth-provider";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  authRequired: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "Feed", icon: Home, authRequired: false },
  { href: "/messages", label: "Messages", icon: MessageSquare, authRequired: true },
  { href: "/profile", label: "Profile", icon: UserCircle, authRequired: true },
  { href: "/live", label: "Live", icon: Clapperboard, authRequired: false },
  { href: "/settings", label: "Settings", icon: Settings, authRequired: true },
  { href: "/developer", label: "Developer", icon: Shield, authRequired: false },
  { href: "/donate", label: "Donate", icon: Gift, authRequired: false },
];

const SidebarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
        await logout();
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        router.push("/login");
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "Could not log you out. Please try again."
        })
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "VU";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  const getUsername = (displayName?: string | null) => {
    if (!displayName) return "@vividuser";
    return `@${displayName.toLowerCase().replace(/\s/g, '_')}`;
  }

  return (
    <div className="flex flex-col h-full text-foreground bg-card">
      <div className="p-4 border-b">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-2">
        {navItems.map((item) => {
          if (item.authRequired && !user) return null;
          // Hide developer tools for non-dev users
          if (item.href === "/developer" && user?.email !== "dev@vividstream.com") return null;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto p-4 border-t">
        {user ? (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt={user.displayName || "user"} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                        <p className="font-semibold truncate">{user.displayName || "Vivid User"}</p>
                        <p className="text-sm text-muted-foreground truncate">{getUsername(user.displayName)}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
                    <LogOut className="h-5 w-5" />
                </Button>
            </div>
        ) : (
             <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" /> Login / Sign Up
                </Link>
            </Button>
        )}
      </div>
    </div>
  );
};

const AppContent = React.memo(function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen w-full md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r md:block">
        <SidebarContent />
      </aside>
      <div className="flex flex-col h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <Link href="/">
                <Logo />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return <AppContent>{children}</AppContent>;
}
