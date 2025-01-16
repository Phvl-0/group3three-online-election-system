import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const registerUser = async ({ email, password, name }: RegisterData) => {
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('Missing environment variables:', {
      url: import.meta.env.VITE_SUPABASE_URL ? 'present' : 'missing',
      key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing'
    });
    throw new Error('Missing Supabase configuration. Please check your environment variables.');
  }

  console.log('Starting registration process...');
  console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

  try {
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

    if (!data.user) {
      throw new Error('No user data returned from registration');
    }

    return data;
  } catch (error: any) {
    console.error('Registration error details:', {
      error,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      message: error.message
    });
    throw error;
  }
};