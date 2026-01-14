import { motion } from 'framer-motion';
import { ExternalLink, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const steps = [
  {
    number: 1,
    title: 'Otvori Remix IDE',
    description: 'Posjeti remix.ethereum.org u browseru',
    link: 'https://remix.ethereum.org',
    linkText: 'Otvori Remix',
  },
  {
    number: 2,
    title: 'Kreiraj novi file',
    description: 'U File Explorer-u klikni "+" i nazovi file "OverHippoLabToken.sol"',
  },
  {
    number: 3,
    title: 'Zalijepi kod',
    description: 'Kopiraj Solidity kod sa lijeve strane i zalijepi u Remix editor',
  },
  {
    number: 4,
    title: 'Compile contract',
    instructions: [
      'Idi na "Solidity Compiler" tab (lijevo)',
      'Odaberi verziju: 0.8.20 ili noviju',
      'Uključi "Enable optimization" (200 runs)',
      'Klikni "Compile OverHippoLabToken.sol"',
    ],
  },
  {
    number: 5,
    title: 'Poveži MetaMask',
    instructions: [
      'Otvori MetaMask',
      'Prebaci se na OverProtocol network',
      'Chain ID: 54176',
      'RPC: https://rpc.overprotocol.com',
    ],
  },
  {
    number: 6,
    title: 'Deploy Contract',
    instructions: [
      'Idi na "Deploy & Run" tab',
      'Environment: "Injected Provider - MetaMask"',
      'Provjeri da piše OverProtocol network',
      'Contract: OverHippoLabToken',
      'Klikni "Deploy" i potvrdi u MetaMask-u',
    ],
  },
  {
    number: 7,
    title: 'Spremi adresu',
    description: 'Nakon deploy-a, kopiraj contract adresu iz "Deployed Contracts" sekcije i unesi je u polje lijevo.',
  },
];

const DeployInstructions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6"
    >
      <h2 className="font-orbitron text-xl font-bold mb-6 text-primary flex items-center gap-3">
        <CheckCircle2 className="w-6 h-6" />
        Deploy Instrukcije
      </h2>

      <div className="space-y-6">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative pl-12"
          >
            {/* Step Number */}
            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
              <span className="font-orbitron font-bold text-primary text-sm">
                {step.number}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[15px] top-8 w-[2px] h-[calc(100%+8px)] bg-primary/20" />
            )}

            {/* Content */}
            <div className="pb-4">
              <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
              
              {step.description && (
                <p className="text-sm text-muted-foreground">{step.description}</p>
              )}

              {step.instructions && (
                <ul className="mt-2 space-y-1">
                  {step.instructions.map((instruction, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              )}

              {step.link && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-3 gap-2"
                >
                  <a href={step.link} target="_blank" rel="noopener noreferrer">
                    {step.linkText}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Warning Box */}
      <div className="mt-6 p-4 bg-neon-orange/10 border border-neon-orange/30 rounded-lg">
        <p className="text-sm text-neon-orange font-medium mb-2">⚠️ Važno!</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Provjeri da imaš dovoljno OVER tokena za gas fee</li>
          <li>• Sačuvaj contract adresu na sigurno mjesto</li>
          <li>• Admin wallet će primiti svih 250M OH.L tokena</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default DeployInstructions;
