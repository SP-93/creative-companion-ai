import { WalletProvider } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WorldChat } from '@/components/WorldChat';

function ChatContent() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <WorldChat />
      </main>
      <Footer />
    </div>
  );
}

const Chat = () => {
  return (
    <WalletProvider>
      <ChatContent />
    </WalletProvider>
  );
};

export default Chat;
