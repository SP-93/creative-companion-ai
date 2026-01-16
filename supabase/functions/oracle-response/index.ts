import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OracleRequest {
  wallet_address: string;
  message: string;
  language?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wallet_address, message, language = 'en' }: OracleRequest = await req.json();

    console.log(`[oracle-response] Request from ${wallet_address}: "${message.slice(0, 50)}..."`);

    // Validate required fields
    if (!wallet_address || !message) {
      return new Response(
        JSON.stringify({ error: 'wallet_address and message required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check user access
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('has_basic_access, dev_tier, dev_expires_at')
      .eq('wallet_address', wallet_address.toLowerCase())
      .single();

    if (profileError || !profile) {
      console.error('[oracle-response] Profile not found:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found. Please connect wallet first.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has Basic or DEV access (required for AI responses)
    const hasDevAccess = profile.dev_tier !== 'none' && 
      profile.dev_expires_at && 
      new Date(profile.dev_expires_at) > new Date();
    
    const hasBasicAccess = profile.has_basic_access;

    if (!hasBasicAccess && !hasDevAccess) {
      console.log('[oracle-response] User does not have access');
      return new Response(
        JSON.stringify({ 
          error: 'Basic or DEV access required for AI Oracle responses',
          upgrade_required: true,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      console.error('[oracle-response] OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'Oracle service not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Call OpenAI API
    console.log('[oracle-response] Calling OpenAI API...');
    
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are the O'HippoLab Oracle, a wise and knowledgeable AI assistant specializing in cryptocurrency, blockchain technology, OverProtocol, and Web3. 
            
You provide accurate, helpful, and concise answers. You are friendly but professional.

Key facts about O'HippoLab:
- OHL is the native token of O'HippoLab platform
- Built on OverProtocol blockchain (Chain ID: 54176)
- The Oracle provides AI-powered insights for crypto users
- DEV tier users get access to advanced AI features

Respond in ${language} language if the user's message is in that language, otherwise respond in English.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('[oracle-response] OpenAI API error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to get Oracle response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const oracleResponse = openaiData.choices[0]?.message?.content || 'No response generated';

    console.log('[oracle-response] Response generated successfully');

    // Store ONLY the Oracle response in chat_messages (user message already saved by frontend)
    await supabase.from('chat_messages').insert({
      wallet_address: wallet_address.toLowerCase(),
      username: 'Oracle AI',
      content: oracleResponse,
      source_lang: language,
      message_type: 'oracle',
      chat_room: 'oracle',
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: oracleResponse,
        tokens_used: openaiData.usage?.total_tokens || 0,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('[oracle-response] Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
