
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
} from "lucide-react";
import React, { useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  { href: "/live", label: "Go Live", icon: Clapperboard, authRequired: true },
  { href: "/developer", label: "Developer", icon: Shield, authRequired: true },
];

const SidebarContent = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "There was an error logging out.",
      });
    }
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "VU";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  const getUsername = (email?: string | null) => {
    if (!email) return "@vividuser";
    return `@${email.split('@')[0]}`;
  }
  
  const visibleNavItems = navItems.filter(item => !item.authRequired || user);

  return (
    <div className="flex flex-col h-full text-foreground bg-card">
      <div className="p-4 border-b">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-2">
        {visibleNavItems.map((item) => (
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
        ))}
      </nav>
      <div className="mt-auto p-4 border-t">
        {user ? (
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || "https://placehold.co/100x100.png"} alt={user.displayName || "user"} />
                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.displayName || "Vivid User"}</p>
                        <p className="text-sm text-muted-foreground">{getUsername(user.email)}</p>
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
      <div className="px-4 pb-2 text-center text-xs text-muted-foreground">
        <p>Created by ajleader</p>
      </div>
    </div>
  );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
        const protectedRoutes = navItems.filter(item => item.authRequired).map(item => item.href);
        if (protectedRoutes.includes(pathname)) {
             router.push("/login");
        }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <p>Loading...</p>
          </div>
      )
  }
  
  if (!user && (pathname === '/login' || pathname === '/signup')) {
      return <>{children}</>
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r md:block">
        <SidebarContent />
      </aside>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:hidden">
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
        <main className="flex-1 flex-col overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
