import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_WALLET = '0x8334966329b7f4b459633696A8CA59118253bC89';

const OVER_RPC_URL = Deno.env.get('OVER_RPC_URL') || 'https://rpc.overprotocol.com';

// Pricing in USD
const PRICES = {
  basic: 1.99,
  shortrun: 1.99,
  standard: 11.99,
  monthly: 19.99,
};

// Duration in milliseconds
const DURATIONS = {
  shortrun: 48 * 60 * 60 * 1000, // 48 hours
  standard: 15 * 24 * 60 * 60 * 1000, // 15 days
  monthly: 30 * 24 * 60 * 60 * 1000, // 30 days
};

interface VerifyPaymentRequest {
  tx_hash: string;
  wallet_address: string;
  payment_type: 'basic' | 'shortrun' | 'standard' | 'monthly';
  amount_over: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tx_hash, wallet_address, payment_type, amount_over }: VerifyPaymentRequest = await req.json();

    console.log(`[verify-payment] Verifying tx: ${tx_hash} for ${wallet_address}, type: ${payment_type}`);

    // Validate required fields
    if (!tx_hash || !wallet_address || !payment_type) {
      console.error('[verify-payment] Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields: tx_hash, wallet_address, payment_type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if payment already exists
    const { data: existingPayment } = await supabase
      .from('payments')
      .select('id')
      .eq('tx_hash', tx_hash)
      .single();

    if (existingPayment) {
      console.log('[verify-payment] Payment already processed:', tx_hash);
      return new Response(
        JSON.stringify({ error: 'Payment already processed', payment_id: existingPayment.id }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify transaction on blockchain
    console.log('[verify-payment] Fetching transaction from blockchain...');
    const txResponse = await fetch(OVER_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionByHash',
        params: [tx_hash],
      }),
    });

    const txData = await txResponse.json();
    
    if (!txData.result) {
      console.error('[verify-payment] Transaction not found on blockchain');
      return new Response(
        JSON.stringify({ error: 'Transaction not found on blockchain' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const tx = txData.result;
    console.log('[verify-payment] Transaction found:', tx.hash);

    // Verify transaction recipient is admin wallet
    if (tx.to?.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
      console.error('[verify-payment] Transaction recipient is not admin wallet');
      return new Response(
        JSON.stringify({ error: 'Transaction recipient is not the correct payment address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify sender matches claimed wallet
    if (tx.from?.toLowerCase() !== wallet_address.toLowerCase()) {
      console.error('[verify-payment] Sender does not match claimed wallet');
      return new Response(
        JSON.stringify({ error: 'Transaction sender does not match wallet address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get transaction receipt to confirm it was successful
    const receiptResponse = await fetch(OVER_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getTransactionReceipt',
        params: [tx_hash],
      }),
    });

    const receiptData = await receiptResponse.json();
    
    if (!receiptData.result) {
      console.log('[verify-payment] Transaction pending, not yet confirmed');
      return new Response(
        JSON.stringify({ error: 'Transaction not yet confirmed, please wait', status: 'pending' }),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const receipt = receiptData.result;
    
    // Check if transaction was successful (status 0x1)
    if (receipt.status !== '0x1') {
      console.error('[verify-payment] Transaction failed on blockchain');
      return new Response(
        JSON.stringify({ error: 'Transaction failed on blockchain' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[verify-payment] Transaction verified successfully!');

    // Calculate expiration for DEV tiers
    let devExpiresAt = null;
    if (payment_type !== 'basic' && DURATIONS[payment_type as keyof typeof DURATIONS]) {
      devExpiresAt = new Date(Date.now() + DURATIONS[payment_type as keyof typeof DURATIONS]).toISOString();
    }

    // Record payment
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        wallet_address: wallet_address.toLowerCase(),
        tx_hash,
        payment_type,
        amount_usd: PRICES[payment_type as keyof typeof PRICES],
        amount_over: amount_over || 0,
        status: 'confirmed',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('[verify-payment] Failed to record payment:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Failed to record payment', details: paymentError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[verify-payment] Payment recorded:', paymentRecord.id);

    // Update user profile
    const updateData: Record<string, unknown> = {};
    
    if (payment_type === 'basic') {
      updateData.has_basic_access = true;
    } else {
      updateData.dev_tier = payment_type;
      updateData.dev_expires_at = devExpiresAt;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('wallet_address', wallet_address.toLowerCase());

    if (profileError) {
      console.error('[verify-payment] Failed to update profile:', profileError);
      // Payment is recorded, but profile update failed - log for manual fix
    } else {
      console.log('[verify-payment] Profile updated successfully');
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentRecord.id,
        payment_type,
        expires_at: devExpiresAt,
        message: `${payment_type === 'basic' ? 'Basic Oracle' : `DEV ${payment_type}`} activated successfully!`,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('[verify-payment] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
