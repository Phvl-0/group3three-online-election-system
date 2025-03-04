
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Sign out the user first
        await supabase.auth.signOut();
        console.log('Signed out existing session');
      }
    };
    
    checkSession();

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      if (event === 'SIGNED_IN' && session) {
        // New users are always voters by default
        toast({
          title: "Registration successful!",
          description: "Redirecting you to the elections page...",
        });
        navigate("/elections");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Starting registration process for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      console.log('Registration response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (data?.user) {
        // Redirect will be handled by auth state change listener
        toast({
          title: "Registration successful!",
          description: data.session ? "Logging you in..." : "Please check your email to verify your account.",
        });
        
        // If we have a session, the user is already logged in
        if (!data.session) {
          // Only redirect to login if email verification is required
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        throw new Error('Registration failed - no user data returned');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      let errorMessage = "Registration failed";
      
      if (error.message.includes("already registered")) {
        errorMessage = "This email is already registered";
      } else if (error.message.includes("password")) {
        errorMessage = "Password must be at least 6 characters";
      } else if (error.message.includes("valid email")) {
        errorMessage = "Please enter a valid email address";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Create an account</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email below to create your account
          </p>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;
