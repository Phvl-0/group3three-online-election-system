import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Vote, Settings, LogOut } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
            <Vote className="h-6 w-6" />
            VoteSecure
          </Link>
          <div className="flex gap-4">
            <Link to="/">
              <Button
                variant={isActive("/") ? "secondary" : "ghost"}
                className="text-white hover:text-white"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link to="/elections">
              <Button
                variant={isActive("/elections") ? "secondary" : "ghost"}
                className="text-white hover:text-white"
              >
                <Vote className="mr-2 h-4 w-4" />
                Elections
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                className="text-white hover:text-white"
              >
                <Settings className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Button variant="ghost" className="text-white hover:text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
};

export default Layout;