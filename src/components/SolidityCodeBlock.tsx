import { motion } from 'framer-motion';
import { Copy, Check, Code2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const SOLIDITY_CODE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title O'HippoLab Token (OHL)
 * @dev ERC-20 token for OHL-Oracle platform
 * @notice Max supply: 250,000,000 OHL
 * @notice Deployed on OverProtocol (Chain ID: 54176)
 */
contract OHippoLabToken is ERC20, ERC20Burnable, Ownable {
    uint256 public constant MAX_SUPPLY = 250_000_000 * 10**18;
    
    constructor() ERC20("O'HippoLab", "OHL") Ownable(msg.sender) {
        // Mint entire supply to deployer (admin) wallet
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    /**
     * @dev Optional: Mint function for future use
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }
}`;

const SolidityCodeBlock = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SOLIDITY_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-orbitron font-semibold text-foreground">
              OHippoLabToken.sol
            </h3>
            <p className="text-xs text-muted-foreground">Solidity ^0.8.20</p>
          </div>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-neon-green" />
              Kopirano!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Kopiraj
            </>
          )}
        </Button>
      </div>

      {/* Code Block */}
      <div className="p-4 bg-[hsl(220,25%,6%)] overflow-x-auto max-h-[600px] overflow-y-auto">
        <pre className="text-sm font-mono leading-relaxed">
          <code className="text-foreground">
            {SOLIDITY_CODE.split('\n').map((line, index) => (
              <div key={index} className="flex">
                <span className="select-none text-muted-foreground w-8 text-right mr-4 flex-shrink-0">
                  {index + 1}
                </span>
                <span className={getLineColor(line)}>{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/20">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Kopiraj ovaj kod i zalijepi u Remix IDE. 
          Koristi Solidity compiler verziju 0.8.20 ili noviju.
        </p>
      </div>
    </motion.div>
  );
};

// Simple syntax highlighting helper
function getLineColor(line: string): string {
  if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/**')) {
    return 'text-muted-foreground';
  }
  if (line.includes('pragma') || line.includes('import') || line.includes('contract') || 
      line.includes('function') || line.includes('constructor')) {
    return 'text-primary';
  }
  if (line.includes('require') || line.includes('return')) {
    return 'text-accent';
  }
  if (line.includes('public') || line.includes('external') || line.includes('constant') || 
      line.includes('view') || line.includes('onlyOwner')) {
    return 'text-neon-blue';
  }
  return 'text-foreground';
}

export default SolidityCodeBlock;
