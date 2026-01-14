import { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { PricingSection } from '@/components/PricingSection';
import { ChatSection } from '@/components/ChatSection';
import { Footer } from '@/components/Footer';
import { UsernameModal } from '@/components/UsernameModal';

function IndexContent() {
  const { isConnected, username } = useWallet();
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    if (isConnected && !username) {
      setShowUsernameModal(true);
    }
  }, [isConnected, username]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <ChatSection />
      <Footer />
      <UsernameModal 
        isOpen={showUsernameModal} 
        onClose={() => setShowUsernameModal(false)} 
      />
    </div>
  );
}

const Index = () => {
  return (
    <WalletProvider>
      <IndexContent />
    </WalletProvider>
  );
};

export default Index;
