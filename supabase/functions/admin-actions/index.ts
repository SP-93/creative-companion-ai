import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_WALLET = '0x8334966329b7f4b459633696A8CA59118253bC89';

// Duration in milliseconds
const DURATIONS = {
  shortrun: 48 * 60 * 60 * 1000, // 48 hours
  standard: 15 * 24 * 60 * 60 * 1000, // 15 days
  monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
};

type AdminAction = 
  | 'activate_basic'
  | 'activate_dev'
  | 'revoke_access'
  | 'extend_subscription'
  | 'get_stats';

interface AdminActionRequest {
  action: AdminAction;
  admin_wallet: string;
  target_wallet?: string;
  dev_tier?: 'shortrun' | 'standard' | 'monthly';
  days?: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, admin_wallet, target_wallet, dev_tier, days }: AdminActionRequest = await req.json();

    console.log(`[admin-actions] Action: ${action} by ${admin_wallet}`);

    // Verify admin wallet
    if (admin_wallet?.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      console.error('[admin-actions] Unauthorized: Not admin wallet');
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case 'activate_basic': {
        if (!target_wallet) {
          return new Response(
            JSON.stringify({ error: 'target_wallet required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('profiles')
          .update({ has_basic_access: true })
          .eq('wallet_address', target_wallet.toLowerCase());

        if (error) {
          console.error('[admin-actions] activate_basic error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to activate basic access', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[admin-actions] Basic access activated for ${target_wallet}`);
        return new Response(
          JSON.stringify({ success: true, message: 'Basic access activated' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'activate_dev': {
        if (!target_wallet || !dev_tier) {
          return new Response(
            JSON.stringify({ error: 'target_wallet and dev_tier required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const duration = DURATIONS[dev_tier];
        if (!duration) {
          return new Response(
            JSON.stringify({ error: 'Invalid dev_tier' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const expiresAt = new Date(Date.now() + duration).toISOString();

        const { error } = await supabase
          .from('profiles')
          .update({ 
            dev_tier,
            dev_expires_at: expiresAt,
          })
          .eq('wallet_address', target_wallet.toLowerCase());

        if (error) {
          console.error('[admin-actions] activate_dev error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to activate DEV access', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[admin-actions] DEV ${dev_tier} activated for ${target_wallet} until ${expiresAt}`);
        return new Response(
          JSON.stringify({ success: true, message: `DEV ${dev_tier} activated`, expires_at: expiresAt }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'revoke_access': {
        if (!target_wallet) {
          return new Response(
            JSON.stringify({ error: 'target_wallet required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const { error } = await supabase
          .from('profiles')
          .update({ 
            has_basic_access: false,
            dev_tier: 'none',
            dev_expires_at: null,
          })
          .eq('wallet_address', target_wallet.toLowerCase());

        if (error) {
          console.error('[admin-actions] revoke_access error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to revoke access', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[admin-actions] Access revoked for ${target_wallet}`);
        return new Response(
          JSON.stringify({ success: true, message: 'Access revoked' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'extend_subscription': {
        if (!target_wallet || !days) {
          return new Response(
            JSON.stringify({ error: 'target_wallet and days required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Get current expiration
        const { data: profile } = await supabase
          .from('profiles')
          .select('dev_expires_at')
          .eq('wallet_address', target_wallet.toLowerCase())
          .single();

        const currentExpiry = profile?.dev_expires_at ? new Date(profile.dev_expires_at) : new Date();
        const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()) + days * 24 * 60 * 60 * 1000);

        const { error } = await supabase
          .from('profiles')
          .update({ dev_expires_at: newExpiry.toISOString() })
          .eq('wallet_address', target_wallet.toLowerCase());

        if (error) {
          console.error('[admin-actions] extend_subscription error:', error);
          return new Response(
            JSON.stringify({ error: 'Failed to extend subscription', details: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`[admin-actions] Subscription extended for ${target_wallet} by ${days} days`);
        return new Response(
          JSON.stringify({ success: true, message: `Subscription extended by ${days} days`, expires_at: newExpiry.toISOString() }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get_stats': {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('*');

        const { data: payments } = await supabase
          .from('payments')
          .select('*')
          .eq('status', 'confirmed');

        const stats = {
          total_users: profiles?.length || 0,
          basic_users: profiles?.filter(p => p.has_basic_access).length || 0,
          dev_users: profiles?.filter(p => p.dev_tier !== 'none').length || 0,
          total_payments: payments?.length || 0,
          total_revenue: payments?.reduce((sum, p) => sum + (p.amount_usd || 0), 0) || 0,
        };

        console.log('[admin-actions] Stats retrieved:', stats);
        return new Response(
          JSON.stringify({ success: true, stats }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error: unknown) {
    console.error('[admin-actions] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
