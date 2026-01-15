import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { ADMIN_WALLET, BASIC_ORACLE_PRICE, DEV_TIERS, type DevTierType } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { ethers } from 'ethers';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentType: 'basic' | DevTierType;
  onSuccess?: () => void;
}

type PaymentStatus = 'idle' | 'confirming' | 'sending' | 'verifying' | 'success' | 'error';

// Hardcoded rate for now - 1 OVER = $1 USD
const OVER_USD_RATE = 1;

export function PaymentModal({ isOpen, onClose, paymentType, onSuccess }: PaymentModalProps) {
  const { isConnected, address } = useWallet();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Get pricing info
  const getPrice = () => {
    if (paymentType === 'basic') return BASIC_ORACLE_PRICE;
    if (paymentType === 'none') return 0;
    return DEV_TIERS[paymentType]?.price || 0;
  };

  const getLabel = () => {
    if (paymentType === 'basic') return 'Basic Oracle';
    if (paymentType === 'none') return '';
    return `DEV ${DEV_TIERS[paymentType]?.label || paymentType}`;
  };

  const getDescription = () => {
    if (paymentType === 'basic') return 'Lifetime access to Oracle insights';
    if (paymentType === 'none') return '';
    return DEV_TIERS[paymentType]?.description || '';
  };

  const priceUSD = getPrice();
  const priceOVER = priceUSD / OVER_USD_RATE;

  const handlePayment = async () => {
    if (!isConnected || !address || !window.ethereum) {
      setError('Please connect your wallet first');
      return;
    }

    setStatus('confirming');
    setError(null);
    setTxHash(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Convert OVER amount to wei (18 decimals)
      const amountWei = ethers.parseEther(priceOVER.toString());

      setStatus('sending');

      // Send transaction
      const tx = await signer.sendTransaction({
        to: ADMIN_WALLET,
        value: amountWei,
      });

      console.log('Transaction sent:', tx.hash);
      setTxHash(tx.hash);
      setStatus('verifying');

      // Wait for confirmation
      await tx.wait();
      console.log('Transaction confirmed');

      // Call verify-payment edge function
      const { data, error: verifyError } = await supabase.functions.invoke('verify-payment', {
        body: {
          tx_hash: tx.hash,
          wallet_address: address,
          payment_type: paymentType,
          amount_over: priceOVER,
        },
      });

      if (verifyError) {
        console.error('Verification error:', verifyError);
        setError('Payment sent but verification failed. Please contact support.');
        setStatus('error');
        return;
      }

      if (data?.error) {
        console.error('Verification returned error:', data.error);
        setError(data.error);
        setStatus('error');
        return;
      }

      console.log('Payment verified:', data);
      setStatus('success');
      onSuccess?.();

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setStatus('error');
    }
  };

  const handleClose = () => {
    if (status === 'sending' || status === 'verifying') {
      // Don't close while processing
      return;
    }
    setStatus('idle');
    setError(null);
    setTxHash(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            Purchase {getLabel()}
            {paymentType !== 'basic' && paymentType !== 'none' && DEV_TIERS[paymentType]?.badge && (
              <Badge variant="secondary" className="bg-neon-green/20 text-neon-green text-xs">
                {DEV_TIERS[paymentType].badge}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Price Display */}
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-muted-foreground">Price (USD)</span>
              <span className="text-foreground font-bold">${priceUSD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount (OVER)</span>
              <span className="text-neon-blue font-bold">{priceOVER.toFixed(4)} OVER</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Rate: 1 OVER = ${OVER_USD_RATE.toFixed(2)} USD
            </p>
          </div>

          {/* Payment Recipient */}
          <div className="bg-background/50 rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Payment to:</p>
            <p className="font-mono text-xs text-foreground break-all">{ADMIN_WALLET}</p>
          </div>

          {/* Status Display */}
          {status !== 'idle' && (
            <div className="bg-background/50 rounded-lg p-4 border border-border">
              {status === 'confirming' && (
                <div className="flex items-center gap-2 text-yellow-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Confirm transaction in your wallet...</span>
                </div>
              )}
              {status === 'sending' && (
                <div className="flex items-center gap-2 text-neon-blue">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending transaction...</span>
                </div>
              )}
              {status === 'verifying' && (
                <div className="flex items-center gap-2 text-neon-blue">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying payment...</span>
                </div>
              )}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-neon-green">
                  <CheckCircle className="w-4 h-4" />
                  <span>Payment successful! Access activated.</span>
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-4 h-4" />
                  <span>{error || 'Payment failed'}</span>
                </div>
              )}
            </div>
          )}

          {/* TX Hash */}
          {txHash && (
            <div className="text-xs text-muted-foreground">
              <span>TX: </span>
              <a 
                href={`https://explorer.overprotocol.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-blue hover:underline font-mono"
              >
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </a>
            </div>
          )}

          {/* Warning */}
          {!isConnected && (
            <div className="flex items-center gap-2 text-yellow-500 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>Please connect your wallet first</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={status === 'sending' || status === 'verifying'}
              className="flex-1"
            >
              {status === 'success' ? 'Close' : 'Cancel'}
            </Button>
            {status !== 'success' && (
              <Button
                onClick={handlePayment}
                disabled={!isConnected || status === 'sending' || status === 'verifying' || status === 'confirming'}
                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-purple"
              >
                {status === 'idle' || status === 'error' ? (
                  `Pay ${priceOVER.toFixed(4)} OVER`
                ) : (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
