import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Vote, Settings, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const NavLinks = () => (
    <>
      <Link to="/">
        <Button
          variant={isActive("/") ? "secondary" : "ghost"}
          className="text-white hover:text-white w-full justify-start"
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </Link>
      <Link to="/elections">
        <Button
          variant={isActive("/elections") ? "secondary" : "ghost"}
          className="text-white hover:text-white w-full justify-start"
        >
          <Vote className="mr-2 h-4 w-4" />
          Elections
        </Button>
      </Link>
      <Link to="/admin">
        <Button
          variant={isActive("/admin") ? "secondary" : "ghost"}
          className="text-white hover:text-white w-full justify-start"
        >
          <Settings className="mr-2 h-4 w-4" />
          Admin
        </Button>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl md:text-2xl font-bold flex items-center gap-2">
            <Vote className="h-6 w-6" />
            VoteSecure
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-4">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" className="text-white p-2">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] bg-primary p-4">
              <SheetHeader>
                <SheetTitle className="text-white">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-4">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      <main className="container mx-auto py-4 md:py-8 px-4">{children}</main>
    </div>
  );
};

export default Layout;