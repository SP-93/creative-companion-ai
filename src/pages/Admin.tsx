import { useState, useEffect } from 'react';
import { WalletProvider, useWallet } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ADMIN_WALLET } from '@/lib/constants';
import { supabase } from '@/lib/supabase';
import { Shield, Users, CreditCard, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import type { Profile, Payment } from '@/types/database';

function AdminContent() {
  const { isConnected, address, connecting } = useWallet();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
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

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
      } else {
        setProfiles(profilesData || []);
        
        // Calculate stats
        const basic = profilesData?.filter(p => p.has_basic_access).length || 0;
        const dev = profilesData?.filter(p => p.dev_tier !== 'none').length || 0;
        setStats(prev => ({
          ...prev,
          totalUsers: profilesData?.length || 0,
          basicUsers: basic,
          devUsers: dev,
        }));
      }

      // Load all payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (paymentsError) {
        console.error('Error loading payments:', paymentsError);
      } else {
        setPayments(paymentsData || []);
        
        // Calculate total revenue
        const revenue = paymentsData
          ?.filter(p => p.status === 'confirmed')
          .reduce((sum, p) => sum + (p.amount_usd || 0), 0) || 0;
        setStats(prev => ({ ...prev, totalRevenue: revenue }));
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (connecting) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  // Not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <AlertTriangle className="w-16 h-16 text-yellow-500" />
          <h1 className="text-2xl font-bold text-foreground">Connect Wallet</h1>
          <p className="text-muted-foreground">Please connect your wallet to access admin panel</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Shield className="w-16 h-16 text-destructive" />
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page</p>
          <p className="text-xs text-muted-foreground">
            Connected: {address?.slice(0, 10)}...{address?.slice(-8)}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Basic Oracle</CardTitle>
              <Shield className="w-4 h-4 text-neon-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.basicUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">DEV Users</CardTitle>
              <CreditCard className="w-4 h-4 text-neon-blue" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.devUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <TrendingUp className="w-4 h-4 text-neon-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : profiles.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No users yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Basic Access</TableHead>
                    <TableHead>DEV Tier</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-mono text-xs">
                        {profile.wallet_address.slice(0, 10)}...{profile.wallet_address.slice(-8)}
                      </TableCell>
                      <TableCell>{profile.username || '-'}</TableCell>
                      <TableCell>
                        {profile.has_basic_access ? (
                          <Badge variant="default" className="bg-neon-green/20 text-neon-green">Active</Badge>
                        ) : (
                          <Badge variant="secondary">No</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {profile.dev_tier !== 'none' ? (
                          <Badge variant="default" className="bg-neon-blue/20 text-neon-blue capitalize">
                            {profile.dev_tier}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {profile.dev_expires_at 
                          ? new Date(profile.dev_expires_at).toLocaleDateString() 
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {new Date(profile.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : payments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No payments yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TX Hash</TableHead>
                    <TableHead>Wallet</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">
                        {payment.tx_hash.slice(0, 10)}...{payment.tx_hash.slice(-8)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {payment.wallet_address.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="capitalize">{payment.payment_type}</TableCell>
                      <TableCell>${payment.amount_usd.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={payment.status === 'confirmed' ? 'default' : 'secondary'}
                          className={payment.status === 'confirmed' ? 'bg-neon-green/20 text-neon-green' : ''}
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Refresh Button */}
        <div className="flex justify-center mt-8">
          <Button onClick={loadAdminData} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Refresh Data
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const Admin = () => {
  return (
    <WalletProvider>
      <AdminContent />
    </WalletProvider>
  );
};

export default Admin;
