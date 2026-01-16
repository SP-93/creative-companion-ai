import { OVER_PROTOCOL } from './constants';

// WalletConnect Project ID - registrovan na cloud.reown.com
export const WALLETCONNECT_PROJECT_ID = '8617065cc8bc205011c57eddae9d6203';

// OverProtocol chain konfiguracija za WalletConnect
export const overProtocolChain = {
  id: OVER_PROTOCOL.chainId,
  name: OVER_PROTOCOL.name,
  network: 'overprotocol',
  nativeCurrency: {
    name: 'OVER',
    symbol: OVER_PROTOCOL.symbol,
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [OVER_PROTOCOL.rpcUrl] },
    public: { http: [OVER_PROTOCOL.rpcUrl] },
  },
  blockExplorers: {
    default: { 
      name: 'OverExplorer', 
      url: OVER_PROTOCOL.explorer 
    },
  },
};

// Metadata za WalletConnect modal
export const walletConnectMetadata = {
  name: "O'HippoLab Oracle",
  description: 'AI-powered Oracle on OverProtocol blockchain',
  url: 'https://ohippolab.com',
  icons: ['https://ohippolab.com/logo.png'],
};

// Provera da li je WalletConnect dostupan
export const isWalletConnectSupported = (): boolean => {
  return typeof window !== 'undefined';
};

// Provera da li je MetaMask instaliran
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

// Detektuj mobilni uređaj
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
