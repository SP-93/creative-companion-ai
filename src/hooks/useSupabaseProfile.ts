import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, DevTier } from '@/types/database';

export function useSupabaseProfile() {
  // Get or create profile for wallet address
  const getOrCreateProfile = useCallback(async (walletAddress: string): Promise<Profile | null> => {
    const normalizedAddress = walletAddress.toLowerCase();
    
    try {
      // First, try to get existing profile
      const { data: existing, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('wallet_address', normalizedAddress)
        .maybeSingle();

      if (existing) return existing as Profile;

      // If no profile exists (no error, just null data), create one
      // Note: NOT including 'id' - let database generate it with gen_random_uuid()
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          wallet_address: normalizedAddress,
          username: null,
          has_basic_access: false,
          dev_tier: 'none',
          dev_expires_at: null,
          preferred_language: 'en',
        })
        .select()
        .single();

      if (insertError) {
        // Handle duplicate key - profile was created by another request
        if (insertError.code === '23505') {
          const { data: retryFetch } = await supabase
            .from('profiles')
            .select('*')
            .eq('wallet_address', normalizedAddress)
            .maybeSingle();
          return retryFetch as Profile | null;
        }
        console.error('Error creating profile:', insertError);
        return null;
      }
      
      return newProfile as Profile;
    } catch (err) {
      console.error('Profile error:', err);
      return null;
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(
    async (walletAddress: string, updates: Partial<Profile>): Promise<boolean> => {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq('wallet_address', walletAddress.toLowerCase());

        if (error) {
          console.error('Error updating profile:', error);
          return false;
        }
        return true;
      } catch (err) {
        console.error('Update profile error:', err);
        return false;
      }
    },
    []
  );

  // Update username
  const updateUsername = useCallback(
    async (walletAddress: string, username: string): Promise<boolean> => {
      return updateProfile(walletAddress, { username });
    },
    [updateProfile]
  );

  // Update subscription status
  const updateSubscription = useCallback(
    async (
      walletAddress: string,
      hasBasicAccess: boolean,
      devTier: DevTier,
      devExpiresAt: Date | null
    ): Promise<boolean> => {
      return updateProfile(walletAddress, {
        has_basic_access: hasBasicAccess,
        dev_tier: devTier,
        dev_expires_at: devExpiresAt?.toISOString() || null,
      });
    },
    [updateProfile]
  );

  // Update preferred language
  const updateLanguage = useCallback(
    async (walletAddress: string, language: string): Promise<boolean> => {
      return updateProfile(walletAddress, { preferred_language: language });
    },
    [updateProfile]
  );

  return {
    getOrCreateProfile,
    updateProfile,
    updateUsername,
    updateSubscription,
    updateLanguage,
  };
}
