export type DevTier = 'none' | 'shortrun' | 'standard' | 'monthly';
export type MessageType = 'user' | 'oracle' | 'system';
export type PaymentType = 'basic_oracle' | 'dev_shortrun' | 'dev_standard' | 'dev_monthly';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed';

export interface Profile {
  id: string;
  wallet_address: string;
  username: string | null;
  has_basic_access: boolean;
  dev_tier: DevTier;
  dev_expires_at: string | null;
  preferred_language: string;
  created_at: string;
  updated_at: string;
}

export type ChatRoom = 'world' | 'oracle';

export interface ChatMessage {
  id: string;
  user_id: string | null;
  username: string;
  wallet_address: string;
  content: string;
  source_lang: string;
  message_type: MessageType;
  chat_room: ChatRoom;
  created_at: string;
}

export interface MessageTranslation {
  id: string;
  message_id: string;
  target_lang: string;
  translated_content: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string | null;
  wallet_address: string;
  tx_hash: string;
  payment_type: PaymentType;
  amount_usd: number;
  amount_over: number | null;
  status: PaymentStatus;
  created_at: string;
}

// Supabase Database Types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id?: string;
          wallet_address: string;
          username?: string | null;
          has_basic_access?: boolean;
          dev_tier?: DevTier;
          dev_expires_at?: string | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          wallet_address?: string;
          username?: string | null;
          has_basic_access?: boolean;
          dev_tier?: DevTier;
          dev_expires_at?: string | null;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_messages: {
        Row: ChatMessage;
        Insert: {
          id?: string;
          user_id?: string | null;
          username: string;
          wallet_address: string;
          content: string;
          source_lang?: string;
          message_type?: MessageType;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          username?: string;
          wallet_address?: string;
          content?: string;
          source_lang?: string;
          message_type?: MessageType;
          created_at?: string;
        };
      };
      message_translations: {
        Row: MessageTranslation;
        Insert: {
          id?: string;
          message_id: string;
          target_lang: string;
          translated_content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          target_lang?: string;
          translated_content?: string;
          created_at?: string;
        };
      };
      payments: {
        Row: Payment;
        Insert: {
          id?: string;
          user_id?: string | null;
          wallet_address: string;
          tx_hash: string;
          payment_type: PaymentType;
          amount_usd: number;
          amount_over?: number | null;
          status?: PaymentStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          wallet_address?: string;
          tx_hash?: string;
          payment_type?: PaymentType;
          amount_usd?: number;
          amount_over?: number | null;
          status?: PaymentStatus;
          created_at?: string;
        };
      };
    };
  };
};
