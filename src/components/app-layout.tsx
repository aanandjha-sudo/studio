
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UserCircle,
  Clapperboard,
  Shield,
  Menu,
  LucideIcon,
  Video,
  MessageSquare,
} from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "./logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/live", label: "Go Live", icon: Clapperboard },
  { href: "/developer", label: "Developer", icon: Shield },
];

const SidebarContent = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col h-full text-foreground bg-card">
      <div className="p-4 border-b">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-2">
        {navItems.map((item) => (
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
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100.png" alt="@vividuser" />
                <AvatarFallback>VU</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold">Vivid User</p>
                <p className="text-sm text-muted-foreground">@vividuser</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default function AppLayout({ children }: { children: React.Node }) {
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
