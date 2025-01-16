import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const registerUser = async ({ email, password, name }: RegisterData) => {
  console.log('Starting registration process...');
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'voter'
        },
        emailRedirectTo: `${window.location.origin}/login`
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
    console.error('Registration error details:', error);
    toast.error(error.message || 'Registration failed');
    throw error;
  }
};