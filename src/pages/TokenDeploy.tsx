import { motion } from 'framer-motion';
import { WalletProvider } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import TokenInfoCard from '@/components/TokenInfoCard';
import SolidityCodeBlock from '@/components/SolidityCodeBlock';
import DeployInstructions from '@/components/DeployInstructions';
import ContractAddressInput from '@/components/ContractAddressInput';
import { CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const TokenDeploy = () => {
  const [contractAddress, setContractAddress] = useState<string>('');
  const [checklist, setChecklist] = useState({
    contractDeployed: false,
    addressSaved: false,
    mintCompleted: false,
    readyForPool: false,
  });

  useEffect(() => {
    // Load saved contract address
    const saved = localStorage.getItem('ohl_token_address');
    if (saved) {
      setContractAddress(saved);
      setChecklist(prev => ({
        ...prev,
        contractDeployed: true,
        addressSaved: true,
      }));
    }
  }, []);

  const handleAddressSaved = (address: string) => {
    setContractAddress(address);
    setChecklist(prev => ({
      ...prev,
      contractDeployed: true,
      addressSaved: true,
    }));
  };

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const checklistItems = [
    { key: 'contractDeployed' as const, label: 'Contract deployovan na OverProtocol' },
    { key: 'addressSaved' as const, label: 'Contract adresa spremljena' },
    { key: 'mintCompleted' as const, label: 'Initial mint obavljen (250M OH.L → Admin wallet)' },
    { key: 'readyForPool' as const, label: 'Spreman za kreiranje LP poola' },
  ];

  return (
    <WalletProvider>
      <div className="min-h-screen bg-background cyber-grid">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 pt-24">
          {/* Back Link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Nazad na početnu
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary to-neon-blue bg-clip-text text-transparent">
                OH.L Token Deploy
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Deployaj OverHippo.Lab token na OverProtocol blockchain. Prati korake ispod za siguran i uspješan deployment.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Token Info & Contract Input */}
            <div className="space-y-6">
              <TokenInfoCard />
              <ContractAddressInput 
                onAddressSaved={handleAddressSaved}
                savedAddress={contractAddress}
              />
              
              {/* Post-Deploy Checklist */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <h3 className="font-orbitron text-lg font-semibold mb-4 text-primary">
                  Post-Deploy Checklist
                </h3>
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => toggleChecklistItem(item.key)}
                      className="flex items-center gap-3 w-full text-left hover:bg-muted/30 p-2 rounded-lg transition-colors"
                    >
                      {checklist[item.key] ? (
                        <CheckCircle className="w-5 h-5 text-neon-green flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className={checklist[item.key] ? 'text-foreground' : 'text-muted-foreground'}>
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Middle Column - Smart Contract Code */}
            <div className="lg:col-span-1">
              <SolidityCodeBlock />
            </div>

            {/* Right Column - Deploy Instructions */}
            <div>
              <DeployInstructions />
            </div>
          </div>
        </main>
      </div>
    </WalletProvider>
  );
};

export default TokenDeploy;
