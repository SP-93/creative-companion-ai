import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';

// OverProtocol Chain Config
const OVER_PROTOCOL = {
  chainId: 54176,
  chainIdHex: '0xD3A0',
  name: 'OverProtocol',
  rpcUrl: 'https://rpc.overprotocol.com',
  symbol: 'OVER',
  explorer: 'https://explorer.overprotocol.com',
};

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  username: string | null;
  hasBasicAccess: boolean;
  hasDevAccess: boolean;
  balance: string;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  setUsername: (name: string) => void;
  setBasicAccess: (access: boolean) => void;
  setDevAccess: (access: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);
  const [hasBasicAccess, setBasicAccess] = useState(false);
  const [hasDevAccess, setDevAccess] = useState(false);
  const [balance, setBalance] = useState('0');
  const [connecting, setConnecting] = useState(false);

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask or another Web3 wallet!');
      return;
    }

    setConnecting(true);
    try {
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        
        // Get balance
        const balanceWei = await provider.getBalance(userAddress);
        setBalance(ethers.formatEther(balanceWei));
        
        // Try to switch to OverProtocol network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: OVER_PROTOCOL.chainIdHex }],
          });
        } catch (switchError: any) {
          // Chain not added, try to add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: OVER_PROTOCOL.chainIdHex,
                chainName: OVER_PROTOCOL.name,
                rpcUrls: [OVER_PROTOCOL.rpcUrl],
                nativeCurrency: {
                  name: 'OVER',
                  symbol: OVER_PROTOCOL.symbol,
                  decimals: 18,
                },
                blockExplorerUrls: [OVER_PROTOCOL.explorer],
              }],
            });
          }
        }
        
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setUsernameState(null);
    setBasicAccess(false);
    setDevAccess(false);
    setBalance('0');
  }, []);

  const setUsername = useCallback((name: string) => {
    setUsernameState(name);
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        username,
        hasBasicAccess,
        hasDevAccess,
        balance,
        connecting,
        connectWallet,
        disconnectWallet,
        setUsername,
        setBasicAccess,
        setDevAccess,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
