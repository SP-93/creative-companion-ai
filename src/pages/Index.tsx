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
  const { isConnected, username, profileLoaded } = useWallet();
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    // Only show username modal if:
    // 1. User is connected
    // 2. Profile has been loaded from Supabase
    // 3. Username is still null (not set)
    if (isConnected && profileLoaded && username === null) {
      setShowUsernameModal(true);
    } else if (username !== null) {
      setShowUsernameModal(false);
    }
  }, [isConnected, username, profileLoaded]);

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
