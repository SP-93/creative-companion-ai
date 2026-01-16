import { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ADMIN_WALLET, TOKEN_INFO, OVER_PROTOCOL } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { useTokenContract } from '@/hooks/useTokenContract';
import { useTokenDeploy, DeployStatus } from '@/hooks/useTokenDeploy';
import { Shield, Users, CreditCard, TrendingUp, AlertTriangle, Loader2, Coins, Flame, RefreshCw, ExternalLink, Rocket, CheckCircle2, XCircle } from 'lucide-react';
import type { Profile, Payment } from '@/types/database';
import { toast } from 'sonner';
import ohlTokenIcon from '@/assets/ohl-token-icon.png';

function AdminContent() {
  const { isConnected, address, connecting } = useWallet();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    tokenInfo, 
    loading: tokenLoading, 
    contractAddress, 
    setContractAddress, 
    loadTokenInfo,
    mint,
    burn,
  } = useTokenContract();

  const {
    status: deployStatus,
    error: deployError,
    result: deployResult,
    deployContract,
    reset: resetDeploy,
  } = useTokenDeploy();
  
  const [newContractAddress, setNewContractAddress] = useState('');
  const [mintAddress, setMintAddress] = useState('');
  const [mintAmount, setMintAmount] = useState('');
  const [burnAmount, setBurnAmount] = useState('');
  const [mintLoading, setMintLoading] = useState(false);
  const [burnLoading, setBurnLoading] = useState(false);
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    basicUsers: 0,
    devUsers: 0,
    totalRevenue: 0,
  });

  const isAdmin = address?.toLowerCase() === ADMIN_WALLET.toLowerCase();

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  // Auto-set contract address after successful deploy
  useEffect(() => {
    if (deployResult?.contractAddress) {
      setContractAddress(deployResult.contractAddress);
    }
  }, [deployResult, setContractAddress]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data: paymentsData } = await supabase.from('payments').select('*').order('created_at', { ascending: false });

      setProfiles(profilesData || []);
      setPayments(paymentsData || []);

      const basic = profilesData?.filter(p => p.has_basic_access).length || 0;
      const dev = profilesData?.filter(p => p.dev_tier !== 'none').length || 0;
      const revenue = paymentsData?.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + (p.amount_usd || 0), 0) || 0;

      setStats({ totalUsers: profilesData?.length || 0, basicUsers: basic, devUsers: dev, totalRevenue: revenue });
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetContract = () => {
    if (newContractAddress?.startsWith('0x')) {
      setContractAddress(newContractAddress);
      toast.success('Contract address saved');
      setNewContractAddress('');
    } else {
      toast.error('Invalid contract address');
    }
  };

  const handleDeploy = async () => {
    try {
      const result = await deployContract();
      toast.success(`Token deployed at ${result.contractAddress.slice(0, 10)}...`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Deploy failed');
    }
  };

  const handleMint = async () => {
    if (!mintAddress || !mintAmount) return toast.error('Enter address and amount');
    setMintLoading(true);
    try {
      const txHash = await mint(mintAddress, mintAmount);
      toast.success(`Minted ${mintAmount} ${TOKEN_INFO.symbol}`);
      setMintAddress(''); setMintAmount(''); loadTokenInfo();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Mint failed');
    } finally { setMintLoading(false); }
  };

  const handleBurn = async () => {
    if (!burnAmount) return toast.error('Enter amount');
    setBurnLoading(true);
    try {
      await burn(burnAmount);
      toast.success(`Burned ${burnAmount} ${TOKEN_INFO.symbol}`);
      setBurnAmount(''); loadTokenInfo();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Burn failed');
    } finally { setBurnLoading(false); }
  };

  const getDeployStatusInfo = (status: DeployStatus) => {
    switch (status) {
      case 'connecting':
        return { text: 'Connecting wallet...', color: 'text-yellow-500', icon: Loader2 };
      case 'deploying':
        return { text: 'Deploying contract...', color: 'text-blue-500', icon: Loader2 };
      case 'success':
        return { text: 'Deployed successfully!', color: 'text-green-500', icon: CheckCircle2 };
      case 'error':
        return { text: 'Deploy failed', color: 'text-red-500', icon: XCircle };
      default:
        return { text: 'Ready to deploy', color: 'text-muted-foreground', icon: Rocket };
    }
  };

  if (connecting) {
    return (
      <div className="min-h-screen bg-background"><Navbar /><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div><Footer /></div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background"><Navbar /><div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><AlertTriangle className="w-16 h-16 text-yellow-500" /><h1 className="text-2xl font-bold">Connect Wallet</h1></div><Footer /></div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background"><Navbar /><div className="flex flex-col items-center justify-center min-h-[60vh] gap-4"><Shield className="w-16 h-16 text-destructive" /><h1 className="text-2xl font-bold">Access Denied</h1></div><Footer /></div>
    );
  }

  const statusInfo = getDeployStatusInfo(deployStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={loadAdminData} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="token">Token Mint</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Basic Oracle</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.basicUsers}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">DEV Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{stats.devUsers}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div></CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle>Users ({profiles.length})</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Wallet</TableHead><TableHead>Username</TableHead><TableHead>Basic</TableHead><TableHead>DEV</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {profiles.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.wallet_address.slice(0, 10)}...</TableCell>
                        <TableCell>{p.username || '-'}</TableCell>
                        <TableCell>{p.has_basic_access ? <Badge className="bg-neon-green/20 text-neon-green">Yes</Badge> : '-'}</TableCell>
                        <TableCell>{p.dev_tier !== 'none' ? <Badge className="bg-neon-blue/20 text-neon-blue capitalize">{p.dev_tier}</Badge> : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader><CardTitle>Payments ({payments.length})</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>TX</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.tx_hash.slice(0, 10)}...</TableCell>
                        <TableCell className="capitalize">{p.payment_type}</TableCell>
                        <TableCell>${p.amount_usd.toFixed(2)}</TableCell>
                        <TableCell><Badge className={p.status === 'confirmed' ? 'bg-neon-green/20 text-neon-green' : ''}>{p.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="token">
            <div className="grid gap-6">
              {/* Deploy Contract Card */}
              {!contractAddress && (
                <Card className="border-2 border-dashed border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <img src={ohlTokenIcon} alt="OHL Token" className="w-16 h-16 rounded-full" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Rocket className="w-5 h-5 text-primary" /> Deploy OHL Token
                        </CardTitle>
                        <CardDescription>
                          Deploy the O'HippoLab token contract to OverProtocol
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Token Name</p>
                        <p className="font-semibold">{TOKEN_INFO.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Symbol</p>
                        <p className="font-semibold">{TOKEN_INFO.symbol}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Max Supply</p>
                        <p className="font-semibold">{TOKEN_INFO.maxSupply.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Network</p>
                        <p className="font-semibold">{OVER_PROTOCOL.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm text-yellow-500">
                        All {TOKEN_INFO.maxSupply.toLocaleString()} tokens will be minted to your wallet. Make sure you have OVER for gas.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color} ${deployStatus === 'connecting' || deployStatus === 'deploying' ? 'animate-spin' : ''}`} />
                      <span className={`text-sm ${statusInfo.color}`}>{statusInfo.text}</span>
                    </div>

                    {deployError && (
                      <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                        <p className="text-sm text-destructive">{deployError}</p>
                      </div>
                    )}

                    {deployResult && (
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg space-y-2">
                        <p className="text-sm text-green-500 font-semibold">🎉 Token deployed successfully!</p>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-background px-2 py-1 rounded flex-1">{deployResult.contractAddress}</code>
                          <a 
                            href={`${OVER_PROTOCOL.explorer}/address/${deployResult.contractAddress}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-green-500 hover:text-green-400"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        onClick={handleDeploy} 
                        disabled={deployStatus === 'connecting' || deployStatus === 'deploying'}
                        className="flex-1 bg-primary hover:bg-primary/80"
                        size="lg"
                      >
                        {deployStatus === 'connecting' || deployStatus === 'deploying' ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <Rocket className="w-5 h-5 mr-2" />
                        )}
                        {deployStatus === 'idle' ? 'DEPLOY CONTRACT' : 
                         deployStatus === 'connecting' ? 'Connecting...' : 
                         deployStatus === 'deploying' ? 'Deploying...' : 
                         deployStatus === 'success' ? 'Deployed!' : 'Try Again'}
                      </Button>
                      {deployStatus === 'error' && (
                        <Button onClick={resetDeploy} variant="outline">
                          Reset
                        </Button>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">Or enter existing contract address:</p>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="0x... contract address" 
                          value={newContractAddress} 
                          onChange={(e) => setNewContractAddress(e.target.value)} 
                        />
                        <Button onClick={handleSetContract} variant="secondary">Set</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contract Info */}
              {contractAddress && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <img src={ohlTokenIcon} alt="OHL Token" className="w-12 h-12 rounded-full" />
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Coins className="w-5 h-5" /> Token Contract
                        </CardTitle>
                        <CardDescription>OHL Token on OverProtocol</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Contract Address:</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-background px-2 py-1 rounded text-xs flex-1">{contractAddress}</code>
                        <a href={`${OVER_PROTOCOL.explorer}/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    {tokenInfo && (
                      <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-background rounded-lg">
                        <div><p className="text-xs text-muted-foreground">Total Supply</p><p className="font-bold">{Number(tokenInfo.totalSupply).toLocaleString()} {tokenInfo.symbol}</p></div>
                        <div><p className="text-xs text-muted-foreground">Max Supply</p><p className="font-bold">{Number(tokenInfo.maxSupply).toLocaleString()} {tokenInfo.symbol}</p></div>
                        <div><p className="text-xs text-muted-foreground">Owner</p><p className="font-mono text-xs">{tokenInfo.owner.slice(0, 10)}...</p></div>
                        <div><p className="text-xs text-muted-foreground">Decimals</p><p className="font-bold">{tokenInfo.decimals}</p></div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button onClick={loadTokenInfo} disabled={tokenLoading} variant="outline" size="sm">
                        {tokenLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh Info'}
                      </Button>
                      <Button 
                        onClick={() => {
                          localStorage.removeItem('ohl_token_contract_address');
                          window.location.reload();
                        }} 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Clear Contract
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mint */}
              {contractAddress && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="w-5 h-5 text-neon-green" /> Mint Tokens</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="Recipient address (0x...)" value={mintAddress} onChange={(e) => setMintAddress(e.target.value)} />
                    <Input placeholder="Amount" type="number" value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
                    <Button onClick={handleMint} disabled={mintLoading} className="w-full bg-neon-green/20 text-neon-green hover:bg-neon-green/30">
                      {mintLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Coins className="w-4 h-4 mr-2" />}Mint
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Burn */}
              {contractAddress && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-destructive" /> Burn Tokens</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <Input placeholder="Amount to burn" type="number" value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)} />
                    <Button onClick={handleBurn} disabled={burnLoading} variant="destructive" className="w-full">
                      {burnLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Flame className="w-4 h-4 mr-2" />}Burn
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

const Admin = () => (
  <WalletProvider>
    <AdminContent />
  </WalletProvider>
);

export default Admin;
