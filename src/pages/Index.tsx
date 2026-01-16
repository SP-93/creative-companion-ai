import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { Footer } from '@/components/Footer';
import { UsernameModal } from '@/components/UsernameModal';

const Index = () => {
  const { isConnected, username, profileLoaded } = useWallet();
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
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
      <Footer />
      <UsernameModal 
        isOpen={showUsernameModal} 
        onClose={() => setShowUsernameModal(false)} 
      />
    </div>
  );
};

export default Index;
