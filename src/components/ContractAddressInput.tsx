import { motion } from 'framer-motion';
import { Save, CheckCircle, ExternalLink, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ContractAddressInputProps {
  onAddressSaved: (address: string) => void;
  savedAddress?: string;
}

const ContractAddressInput = ({ onAddressSaved, savedAddress }: ContractAddressInputProps) => {
  const [address, setAddress] = useState(savedAddress || '');
  const [isSaved, setIsSaved] = useState(!!savedAddress);
  const [error, setError] = useState('');

  useEffect(() => {
    if (savedAddress) {
      setAddress(savedAddress);
      setIsSaved(true);
    }
  }, [savedAddress]);

  const validateAddress = (addr: string): boolean => {
    // Basic Ethereum address validation
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleSave = () => {
    const trimmedAddress = address.trim();
    
    if (!trimmedAddress) {
      setError('Unesi contract adresu');
      return;
    }

    if (!validateAddress(trimmedAddress)) {
      setError('Nevažeća adresa. Mora počinjati sa 0x i imati 40 hex karaktera.');
      return;
    }

    // Save to localStorage
    localStorage.setItem('ohl_token_address', trimmedAddress);
    setIsSaved(true);
    setError('');
    onAddressSaved(trimmedAddress);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setIsSaved(false);
    setError('');
  };

  const explorerUrl = address && validateAddress(address) 
    ? `https://explorer.overprotocol.com/address/${address}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <h3 className="font-orbitron text-lg font-semibold mb-4 text-primary flex items-center gap-2">
        <Wallet className="w-5 h-5" />
        Contract Adresa
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-2">
            OH.L Token Contract Address
          </label>
          <Input
            value={address}
            onChange={handleChange}
            placeholder="0x..."
            className={`font-mono text-sm ${error ? 'border-destructive' : ''} ${isSaved ? 'border-neon-green/50' : ''}`}
          />
          {error && (
            <p className="text-destructive text-sm mt-1">{error}</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaved && address === savedAddress}
            className="flex-1 gap-2"
            variant={isSaved ? 'outline' : 'default'}
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-neon-green" />
                Spremljeno
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Spremi adresu
              </>
            )}
          </Button>

          {explorerUrl && (
            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                Explorer
              </a>
            </Button>
          )}
        </div>

        {isSaved && address && (
          <div className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-lg">
            <p className="text-sm text-neon-green flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Contract adresa uspješno spremljena!
            </p>
            <code className="text-xs text-muted-foreground mt-1 block break-all">
              {address}
            </code>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContractAddressInput;
