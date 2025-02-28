
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Vote, Settings, Menu, LogOut, LogIn, UserPlus, BarChart, User, ListChecks } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);

        if (session) {
          // Check if user is admin
          const { data, error } = await supabase.rpc('has_role', {
            '_role': 'admin'
          });
          
          if (error) throw error;
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoggedIn(true);
        checkAuth();
      } else if (event === 'SIGNED_OUT') {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out.",
        variant: "destructive",
      });
    }
  };

  const GuestNavLinks = () => (
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
      <Link to="/login">
        <Button
          variant={isActive("/login") ? "secondary" : "ghost"}
          className="text-white hover:text-white w-full justify-start"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Button>
      </Link>
      <Link to="/register">
        <Button
          variant={isActive("/register") ? "secondary" : "ghost"}
          className="text-white hover:text-white w-full justify-start"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Register
        </Button>
      </Link>
    </>
  );

  const UserNavLinks = () => (
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
          Vote Now
        </Button>
      </Link>
      <Link to="/results">
        <Button
          variant={isActive("/results") ? "secondary" : "ghost"}
          className="text-white hover:text-white w-full justify-start"
        >
          <BarChart className="mr-2 h-4 w-4" />
          Results
        </Button>
      </Link>
      <Link to="/profile">
        <Button
          variant={isActive("/profile") ? "secondary" : "ghost"}
          className="text-white hover:text-white w-full justify-start"
        >
          <User className="mr-2 h-4 w-4" />
          My Profile
        </Button>
      </Link>
      {isAdmin && (
        <Link to="/admin">
          <Button
            variant={isActive("/admin") ? "secondary" : "ghost"}
            className="text-white hover:text-white w-full justify-start"
          >
            <Settings className="mr-2 h-4 w-4" />
            Admin Dashboard
          </Button>
        </Link>
      )}
      <Button
        variant="ghost"
        className="text-white hover:text-white w-full justify-start"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </>
  );

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

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
            {isLoggedIn ? <UserNavLinks /> : <GuestNavLinks />}
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
                {isLoggedIn ? <UserNavLinks /> : <GuestNavLinks />}
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
