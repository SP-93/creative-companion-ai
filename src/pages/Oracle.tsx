import { WalletProvider } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OracleChat } from '@/components/OracleChat';

function OracleContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <OracleChat />
      </main>
      <Footer />
    </div>
  );
}

const Oracle = () => {
  return (
    <WalletProvider>
      <OracleContent />
    </WalletProvider>
  );
};

export default Oracle;
