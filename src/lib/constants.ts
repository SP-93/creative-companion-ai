// Admin Wallet Address - receives all payments
export const ADMIN_WALLET = '0x8334966329b7f4b459633696A8CA59118253bC89';

// Token Info
export const TOKEN_INFO = {
  name: 'OverHippo.Lab',
  symbol: 'OH.L',
  decimals: 18,
  maxSupply: 250_000_000,
  network: 'OverProtocol',
  chainId: 54176,
};

// Pricing Configuration
export const BASIC_ORACLE_PRICE = 1.99;

export type DevTierType = 'none' | 'shortrun' | 'standard' | 'monthly';

export const DEV_TIERS = {
  shortrun: {
    id: 'shortrun' as const,
    price: 1.99,
    duration: 48 * 60 * 60 * 1000, // 48 hours in ms
    label: '48h',
    description: 'Quick Trial',
    badge: null,
  },
  standard: {
    id: 'standard' as const,
    price: 11.99,
    duration: 15 * 24 * 60 * 60 * 1000, // 15 days in ms
    label: '15 Days',
    description: 'Best Value',
    badge: 'BEST VALUE',
  },
  monthly: {
    id: 'monthly' as const,
    price: 19.99,
    duration: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
    label: 'Monthly',
    description: 'Full Access',
    badge: null,
  },
} as const;

// OverProtocol Chain Config
export const OVER_PROTOCOL = {
  chainId: 54176,
  chainIdHex: '0xD3A0',
  name: 'OverProtocol',
  rpcUrl: 'https://rpc.overprotocol.com',
  symbol: 'OVER',
  explorer: 'https://explorer.overprotocol.com',
};
