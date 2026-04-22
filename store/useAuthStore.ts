import { create } from 'zustand';
import { User } from '@/types';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

// Converts a Supabase auth user + profile into our app User type
function toAppUser(supabaseUser: { id: string; email?: string }, profile?: Record<string, unknown>): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    username: (profile?.username as string) ?? supabaseUser.email?.split('@')[0] ?? '',
    displayName: (profile?.display_name as string) ?? undefined,
    avatarUrl: (profile?.avatar_url as string) ?? undefined,
    preferredSizes: (profile?.preferred_sizes as string[]) ?? [],
    favouriteColors: (profile?.favourite_colors as string[]) ?? [],
    preferredBrands: (profile?.preferred_brands as string[]) ?? [],
    location: (profile?.location as string) ?? undefined,
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  isLoading: false,

  setSession: (session) => {
    if (!session) {
      set({ user: null, session: null });
      return;
    }
    set({ session });
    // Load profile from Supabase
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        set({ user: toAppUser(session.user, data ?? undefined) });
      });
  },

  signIn: async (email, password) => {
    set({ isLoading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ isLoading: false });
    if (error) throw error;
  },

  signUp: async (email, password, username) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error || !data.user) {
      set({ isLoading: false });
      throw error ?? new Error('Sign-up failed');
    }
    // Create profile row
    await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      preferred_sizes: [],
      favourite_colors: [],
      preferred_brands: [],
    });
    set({ isLoading: false });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
