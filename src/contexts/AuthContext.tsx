import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initSession = async () => {
      console.log('Initializing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session initialization error:', error);
      }
      
      console.log('Session data:', session);
      
      setUser(session ? {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.email === 'group3reee@gmail.com' ? 'admin' : 'voter'
      } : null);
      setLoading(false);
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event);
      console.log('New session:', session);
      
      setUser(session ? {
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.email === 'group3reee@gmail.com' ? 'admin' : 'voter'
      } : null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, redirectTo?: string) => {
    try {
      console.log('Attempting sign in for:', email);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: email === 'group3reee@gmail.com' ? "Welcome, Admin!" : "Welcome back!",
      });

      // Handle redirection based on user role and redirectTo parameter
      if (email === 'group3reee@gmail.com') {
        navigate('/admin');
      } else {
        navigate(redirectTo || '/elections');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};