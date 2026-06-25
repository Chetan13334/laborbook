import { supabase } from '@/backend/client';

// This is an initial structure for auth.
// It can easily be expanded to support phone OTP, Google Sign-in, etc.
export const AuthService = {
  // Email/Password Sign Up
  async signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    return { data, error };
  },

  // Email/Password Sign In
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Log Out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Fetch current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },
};
