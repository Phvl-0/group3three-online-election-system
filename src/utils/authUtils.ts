import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const registerUser = async ({ email, password, name }: RegisterData) => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase configuration. Please check your environment variables.');
  }

  console.log('Starting registration process...');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: 'voter'
      }
    }
  });

  console.log('Registration response:', { data, error });

  if (error) {
    console.error('Registration error:', error);
    throw error;
  }

  return data;
};