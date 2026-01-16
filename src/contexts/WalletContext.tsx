import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { OVER_PROTOCOL, DevTierType, ADMIN_WALLET } from '@/lib/constants';
import { useSupabaseProfile } from '@/hooks/useSupabaseProfile';

const WALLET_STORAGE_KEY = 'ohl_wallet_address';
const CONNECTION_TYPE_KEY = 'ohl_connection_type';

// Normalize admin wallet for comparison
const ADMIN_WALLET_NORMALIZED = ADMIN_WALLET.toLowerCase();

export type ConnectionType = 'metamask' | 'walletconnect' | null;

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  username: string | null;
  hasBasicAccess: boolean;
  hasDevAccess: boolean;
  devTier: DevTierType;
  devExpiresAt: Date | null;
  balance: string;
  connecting: boolean;
  profileLoaded: boolean;
  connectionType: ConnectionType;
  showWalletModal: boolean;
  isAdmin: boolean;
  setShowWalletModal: (show: boolean) => void;
  connectWallet: () => void;
  connectWithMetaMask: () => Promise<void>;
  connectWithWalletConnect: () => Promise<void>;
  disconnectWallet: () => void;
  setUsername: (name: string) => Promise<void>;
  setBasicAccess: (access: boolean) => void;
  setDevAccess: (access: boolean) => void;
  setDevTier: (tier: DevTierType, expiresAt: Date | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [username, setUsernameState] = useState<string | null>(null);
  const [hasBasicAccess, setBasicAccess] = useState(false);
  const [hasDevAccess, setDevAccess] = useState(false);
  const [devTier, setDevTierState] = useState<DevTierType>('none');
  const [devExpiresAt, setDevExpiresAt] = useState<Date | null>(null);
  const [balance, setBalance] = useState('0');
  const [connecting, setConnecting] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [connectionType, setConnectionType] = useState<ConnectionType>(null);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const { getOrCreateProfile, updateUsername: updateProfileUsername } = useSupabaseProfile();

  // Check if current address is admin
  const isAdmin = address?.toLowerCase() === ADMIN_WALLET_NORMALIZED;

  // Load profile from Supabase when address changes
  const loadProfile = useCallback(async (walletAddress: string) => {
    setProfileLoaded(false);
    const isAdminWallet = walletAddress.toLowerCase() === ADMIN_WALLET_NORMALIZED;
    
    try {
      const profile = await getOrCreateProfile(walletAddress);
      
      if (profile) {
        setUsernameState(profile.username || (isAdminWallet ? 'Admin' : null));
        // Admin always has full access regardless of database
        setBasicAccess(isAdminWallet ? true : profile.has_basic_access);
        setDevTierState(isAdminWallet ? 'monthly' : (profile.dev_tier as DevTierType));
        setDevExpiresAt(isAdminWallet ? null : (profile.dev_expires_at ? new Date(profile.dev_expires_at) : null));
        setDevAccess(isAdminWallet ? true : profile.dev_tier !== 'none');
      } else if (isAdminWallet) {
        // Admin wallet - grant full access even without profile
        console.log('Admin wallet detected - granting full access');
        setUsernameState('Admin');
        setBasicAccess(true);
        setDevTierState('monthly');
        setDevExpiresAt(null);
        setDevAccess(true);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      // Even on error, grant admin access if it's the admin wallet
      if (isAdminWallet) {
        setUsernameState('Admin');
        setBasicAccess(true);
        setDevTierState('monthly');
        setDevAccess(true);
      }
    } finally {
      setProfileLoaded(true);
    }
  }, [getOrCreateProfile]);

  // Auto-reconnect on page load if wallet was previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem(WALLET_STORAGE_KEY);
    const savedConnectionType = localStorage.getItem(CONNECTION_TYPE_KEY) as ConnectionType;
    
    if (savedAddress) {
      // Add delay to ensure MetaMask is fully loaded
      const timer = setTimeout(async () => {
        if (typeof window.ethereum === 'undefined') {
          console.log('MetaMask not detected, clearing saved wallet');
          localStorage.removeItem(WALLET_STORAGE_KEY);
          localStorage.removeItem(CONNECTION_TYPE_KEY);
          return;
        }

        try {
          setConnecting(true);
          const provider = new ethers.BrowserProvider(window.ethereum);
          
          // Use eth_accounts (not eth_requestAccounts) to avoid popup
          const accounts = await provider.send('eth_accounts', []);
          
          if (accounts.length > 0 && accounts[0].toLowerCase() === savedAddress.toLowerCase()) {
            const userAddress = accounts[0];
            setAddress(userAddress);
            setConnectionType(savedConnectionType || 'metamask');
            
            // Get balance
            try {
              const balanceWei = await provider.getBalance(userAddress);
              setBalance(ethers.formatEther(balanceWei));
            } catch (balanceError) {
              console.warn('Could not fetch balance:', balanceError);
            }
            
            // Load profile
            await loadProfile(userAddress);
            setIsConnected(true);
            console.log('Auto-reconnected successfully:', userAddress.slice(0, 10) + '...');
          } else {
            // Wallet disconnected or switched accounts
            console.log('Wallet account changed or disconnected');
            localStorage.removeItem(WALLET_STORAGE_KEY);
            localStorage.removeItem(CONNECTION_TYPE_KEY);
          }
        } catch (error) {
          console.error('Auto-reconnect failed:', error);
          localStorage.removeItem(WALLET_STORAGE_KEY);
          localStorage.removeItem(CONNECTION_TYPE_KEY);
        } finally {
          setConnecting(false);
        }
      }, 500); // 500ms delay for MetaMask to initialize
      
      return () => clearTimeout(timer);
    }
  }, [loadProfile]);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') return;

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnectWallet();
      } else if (accounts[0].toLowerCase() !== address?.toLowerCase()) {
        // User switched accounts
        const newAddress = accounts[0];
        setAddress(newAddress);
        localStorage.setItem(WALLET_STORAGE_KEY, newAddress);
        await loadProfile(newAddress);
      }
    };

    const handleChainChanged = () => {
      // Reload when chain changes
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [address, loadProfile]);

  // Open wallet selection modal
  const connectWallet = useCallback(() => {
    setShowWalletModal(true);
  }, []);

  // Connect with MetaMask
  const connectWithMetaMask = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setConnecting(true);
    setConnectionType('metamask');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        
        localStorage.setItem(WALLET_STORAGE_KEY, userAddress);
        localStorage.setItem(CONNECTION_TYPE_KEY, 'metamask');
        
        const balanceWei = await provider.getBalance(userAddress);
        setBalance(ethers.formatEther(balanceWei));
        
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: OVER_PROTOCOL.chainIdHex }],
          });
        } catch (switchError: any) {
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
        
        await loadProfile(userAddress);
        setIsConnected(true);
        setShowWalletModal(false);
      }
    } catch (error) {
      console.error('Failed to connect MetaMask:', error);
      setConnectionType(null);
    } finally {
      setConnecting(false);
    }
  }, [loadProfile]);

  // Connect with WalletConnect - opens QR modal
  const connectWithWalletConnect = useCallback(async () => {
    setConnecting(true);
    setConnectionType('walletconnect');
    try {
      // For now, show alert - full WalletConnect requires more setup
      alert('WalletConnect QR: Uskoro dostupno! Za sada koristite MetaMask.');
      setShowWalletModal(false);
    } catch (error) {
      console.error('Failed to connect WalletConnect:', error);
    } finally {
      setConnecting(false);
      setConnectionType(null);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setIsConnected(false);
    setAddress(null);
    setUsernameState(null);
    setBasicAccess(false);
    setDevAccess(false);
    setDevTierState('none');
    setDevExpiresAt(null);
    setBalance('0');
    setProfileLoaded(false);
    setConnectionType(null);
    localStorage.removeItem(WALLET_STORAGE_KEY);
    localStorage.removeItem(CONNECTION_TYPE_KEY);
  }, []);

  const setUsername = useCallback(async (name: string) => {
    setUsernameState(name);
    if (address) {
      const success = await updateProfileUsername(address, name);
      if (!success) {
        console.error('Failed to save username to database');
      }
    }
  }, [address, updateProfileUsername]);

  const setDevTier = useCallback((tier: DevTierType, expiresAt: Date | null) => {
    setDevTierState(tier);
    setDevExpiresAt(expiresAt);
    setDevAccess(tier !== 'none');
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        username,
        hasBasicAccess,
        hasDevAccess,
        devTier,
        devExpiresAt,
        balance,
        connecting,
        profileLoaded,
        connectionType,
        showWalletModal,
        isAdmin,
        setShowWalletModal,
        connectWallet,
        connectWithMetaMask,
        connectWithWalletConnect,
        disconnectWallet,
        setUsername,
        setBasicAccess,
        setDevAccess,
        setDevTier,
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
