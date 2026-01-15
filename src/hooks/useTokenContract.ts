import { useState, useCallback, useEffect } from 'react';
import { ethers } from 'ethers';
import { TOKEN_INFO, OVER_PROTOCOL } from '@/lib/constants';

// OHL Token ABI (ERC20 + Mint + Burn)
const TOKEN_ABI = [
  // ERC20 Standard
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  // Ownable
  'function owner() view returns (address)',
  // Custom
  'function maxSupply() view returns (uint256)',
  'function mint(address to, uint256 amount)',
  'function burn(uint256 amount)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Mint(address indexed to, uint256 amount)',
  'event Burn(address indexed from, uint256 amount)',
];

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  maxSupply: string;
  owner: string;
  contractAddress: string;
}

interface UseTokenContractReturn {
  tokenInfo: TokenInfo | null;
  loading: boolean;
  error: string | null;
  contractAddress: string | null;
  setContractAddress: (address: string) => void;
  loadTokenInfo: () => Promise<void>;
  getBalance: (address: string) => Promise<string>;
  mint: (to: string, amount: string) => Promise<string>;
  burn: (amount: string) => Promise<string>;
  transfer: (to: string, amount: string) => Promise<string>;
}

const CONTRACT_ADDRESS_KEY = 'ohl_token_contract_address';

export function useTokenContract(): UseTokenContractReturn {
  const [contractAddress, setContractAddressState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(CONTRACT_ADDRESS_KEY);
    }
    return null;
  });
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setContractAddress = useCallback((address: string) => {
    const normalizedAddress = address.toLowerCase();
    localStorage.setItem(CONTRACT_ADDRESS_KEY, normalizedAddress);
    setContractAddressState(normalizedAddress);
    setTokenInfo(null);
    setError(null);
  }, []);

  const getProvider = useCallback(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return new ethers.BrowserProvider(window.ethereum);
    }
    return new ethers.JsonRpcProvider(OVER_PROTOCOL.rpcUrl);
  }, []);

  const getContract = useCallback((signerOrProvider: ethers.Signer | ethers.Provider) => {
    if (!contractAddress) {
      throw new Error('Contract address not set');
    }
    return new ethers.Contract(contractAddress, TOKEN_ABI, signerOrProvider);
  }, [contractAddress]);

  const loadTokenInfo = useCallback(async () => {
    if (!contractAddress) {
      setError('Contract address not set');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const provider = getProvider();
      const contract = getContract(provider);

      const [name, symbol, decimals, totalSupply, maxSupply, owner] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
        contract.maxSupply(),
        contract.owner(),
      ]);

      setTokenInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: ethers.formatUnits(totalSupply, decimals),
        maxSupply: ethers.formatUnits(maxSupply, decimals),
        owner,
        contractAddress,
      });
    } catch (err) {
      console.error('Failed to load token info:', err);
      setError(err instanceof Error ? err.message : 'Failed to load token info');
    } finally {
      setLoading(false);
    }
  }, [contractAddress, getProvider, getContract]);

  const getBalance = useCallback(async (address: string): Promise<string> => {
    const provider = getProvider();
    const contract = getContract(provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  }, [getProvider, getContract]);

  const mint = useCallback(async (to: string, amount: string): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);

    console.log(`Minting ${amount} ${TOKEN_INFO.symbol} to ${to}...`);
    const tx = await contract.mint(to, amountWei);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    return tx.hash;
  }, [getContract]);

  const burn = useCallback(async (amount: string): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);

    console.log(`Burning ${amount} ${TOKEN_INFO.symbol}...`);
    const tx = await contract.burn(amountWei);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    return tx.hash;
  }, [getContract]);

  const transfer = useCallback(async (to: string, amount: string): Promise<string> => {
    if (!window.ethereum) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount, decimals);

    console.log(`Transferring ${amount} ${TOKEN_INFO.symbol} to ${to}...`);
    const tx = await contract.transfer(to, amountWei);
    console.log('Transaction sent:', tx.hash);

    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    return tx.hash;
  }, [getContract]);

  // Auto-load token info when contract address is set
  useEffect(() => {
    if (contractAddress) {
      loadTokenInfo();
    }
  }, [contractAddress, loadTokenInfo]);

  return {
    tokenInfo,
    loading,
    error,
    contractAddress,
    setContractAddress,
    loadTokenInfo,
    getBalance,
    mint,
    burn,
    transfer,
  };
}
