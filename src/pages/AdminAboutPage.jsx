
import React from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Shield, Info, Server, Cpu, Database, Globe } from 'lucide-react';
import AdminAccessControl, { PERMISSIONS } from '@/components/AdminAccessControl.jsx';

export default function AdminAboutPage() {
  return (
    <AdminAccessControl requiredRoles={PERMISSIONS.MODERATOR}>
      <div className="flex-1 p-6 md:p-8 max-w-5xl mx-auto space-y-8 w-full animate-in fade-in zoom-in-95">
        <Helmet><title>About Platform | Admin</title></Helmet>
        
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-inner">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">About NICD</h1>
            <p className="text-muted-foreground font-medium mt-1">Platform architecture and environment details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-2 border-border shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-blue-500" /> Platform Info</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">System Version</span>
                <span className="font-mono font-medium">v3.4.1 (Stable)</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">Environment</span>
                <span className="font-mono font-medium text-emerald-500">Production</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider">License</span>
                <span className="font-mono font-medium">NICD Enterprise</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-border shadow-sm rounded-2xl">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5 text-purple-500" /> Services</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Globe className="w-4 h-4"/> Client</span>
                <span className="font-mono font-medium">React 18 / Vite</span>
              </div>
              <div className="flex justify-between border-b border-border/50 pb-2">
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Database className="w-4 h-4"/> Database</span>
                <span className="font-mono font-medium">PocketBase 0.25+</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground font-bold text-sm uppercase tracking-wider flex items-center gap-2"><Cpu className="w-4 h-4"/> Backend</span>
                <span className="font-mono font-medium">Express.js API</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-card border-2 border-border shadow-sm rounded-2xl overflow-hidden">
          <div className="p-8 text-center bg-muted/20">
            <h3 className="text-xl font-black mb-2">Legal & Compliance</h3>
            <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
              NICD Productions handles user data and payments securely. All real-time operations, leaderboards, and administrative tools operate under strict access control and auditing. By accessing this portal, you agree to the Administrator Code of Conduct.
            </p>
          </div>
        </Card>

      </div>
    </AdminAccessControl>
  );
}
