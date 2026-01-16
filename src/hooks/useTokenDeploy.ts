import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { OVER_PROTOCOL, TOKEN_INFO } from '@/lib/constants';
import { OHL_TOKEN_BYTECODE, OHL_TOKEN_ABI } from '@/lib/tokenBytecode';

export type DeployStatus = 'idle' | 'connecting' | 'deploying' | 'success' | 'error';

interface DeployResult {
  contractAddress: string;
  txHash: string;
}

interface UseTokenDeployReturn {
  status: DeployStatus;
  error: string | null;
  result: DeployResult | null;
  deployContract: () => Promise<DeployResult>;
  reset: () => void;
}

const CONTRACT_ADDRESS_KEY = 'ohl_token_contract_address';

export function useTokenDeploy(): UseTokenDeployReturn {
  const [status, setStatus] = useState<DeployStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DeployResult | null>(null);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setResult(null);
  }, []);

  const deployContract = useCallback(async (): Promise<DeployResult> => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    setStatus('connecting');
    setError(null);
    setResult(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Check if on correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== OVER_PROTOCOL.chainIdHex) {
        // Try to switch network
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: OVER_PROTOCOL.chainIdHex }],
          });
        } catch (switchError: any) {
          // Network not added, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: OVER_PROTOCOL.chainIdHex,
                chainName: OVER_PROTOCOL.name,
                rpcUrls: [OVER_PROTOCOL.rpcUrl],
                nativeCurrency: {
                  name: OVER_PROTOCOL.symbol,
                  symbol: OVER_PROTOCOL.symbol,
                  decimals: 18,
                },
                blockExplorerUrls: [OVER_PROTOCOL.explorer],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }

      setStatus('deploying');

      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const deployerAddress = await signer.getAddress();

      console.log('Deploying OHL Token...');
      console.log('Deployer:', deployerAddress);
      console.log('Network:', OVER_PROTOCOL.name);

      // Create contract factory
      const factory = new ethers.ContractFactory(OHL_TOKEN_ABI, OHL_TOKEN_BYTECODE, signer);

      // Deploy contract (no constructor arguments)
      const contract = await factory.deploy();
      console.log('Transaction sent:', contract.deploymentTransaction()?.hash);

      // Wait for deployment
      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();
      const txHash = contract.deploymentTransaction()?.hash || '';

      console.log('Contract deployed at:', contractAddress);
      console.log('Transaction hash:', txHash);

      // Save to localStorage
      localStorage.setItem(CONTRACT_ADDRESS_KEY, contractAddress.toLowerCase());

      const deployResult: DeployResult = {
        contractAddress,
        txHash,
      };

      setResult(deployResult);
      setStatus('success');

      return deployResult;
    } catch (err) {
      console.error('Deploy failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Deploy failed';
      setError(errorMessage);
      setStatus('error');
      throw err;
    }
  }, []);

  return {
    status,
    error,
    result,
    deployContract,
    reset,
  };
}
