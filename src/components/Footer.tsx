import { motion } from 'framer-motion';
import ohlLogo from '@/assets/ohl-logo.png';

export function Footer() {
  return (
    <footer className="py-12 border-t border-border relative">
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={ohlLogo} alt="OHL Logo" className="w-10 h-10" />
              <div>
                <span className="font-display text-lg font-bold text-primary">OHL-Oracle</span>
                <p className="text-xs text-muted-foreground">Over Hippo Lab</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              AI-powered community chat platform with Oracle system built on OverProtocol blockchain. 
              Connect, learn, and earn with OH.L token.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#chat" className="text-muted-foreground hover:text-primary transition-colors">Chat</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Smart Contracts</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">OH.L Token</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">OverProtocol</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 Over Hippo Lab. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Chain ID: 54176</span>
            <span>•</span>
            <span>WOVER: 0x59c9...1e273</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
