
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Activity, Search, Filter, RefreshCw, Loader2, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import AdminAccessControl, { PERMISSIONS } from '@/components/AdminAccessControl.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export default function AdminActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      // Attempt to load from admin_audit_log, fallback to game sessions for activity if audit log is restricted
      const records = await pb.collection('admin_audit_log').getList(1, 50, {
        sort: '-created',
        expand: 'adminId',
        $autoCancel: false
      });
      setLogs(records.items);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load live audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Setup Real-time subscription
    let unsubscribe;
    pb.collection('admin_audit_log').subscribe('*', function (e) {
      if (e.action === 'create') {
        setLogs(prev => [e.record, ...prev].slice(0, 50));
      }
    }).then(unsub => { unsubscribe = unsub; }).catch(console.error);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action?.toLowerCase().includes(search.toLowerCase()) || log.id.includes(search);
    return matchesSearch;
  });

  return (
    <AdminAccessControl requiredRoles={PERMISSIONS.ADMIN}>
      <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto space-y-6 w-full">
        <Helmet><title>Live Activity Log | Admin</title></Helmet>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
              <Activity className="w-8 h-8 text-primary" /> Live Activity Log
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Real-time tracking of platform and administrative actions.</p>
          </div>
          <Button onClick={fetchLogs} variant="outline" className="font-bold border-2">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
        </div>

        <Card className="border-2 border-border shadow-sm rounded-2xl overflow-hidden bg-card">
          <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search actions or IDs..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 h-10 border-2 rounded-lg bg-background"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {['all', 'auth', 'game', 'tournament', 'system'].map(type => (
                <Badge 
                  key={type} 
                  variant={filterType === type ? 'default' : 'outline'}
                  className="cursor-pointer capitalize px-3 py-1 text-xs"
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="divide-y divide-border">
            {loading && logs.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                <p>Loading activity stream...</p>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <ShieldAlert className="w-12 h-12 opacity-20 mx-auto mb-3" />
                <p className="font-bold text-foreground">No records found</p>
                <p className="text-sm">Try adjusting your search criteria.</p>
              </div>
            ) : filteredLogs.map((log) => (
              <div key={log.id} className="p-4 sm:px-6 hover:bg-muted/30 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground leading-tight">{log.action}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                      Target: {log.targetCollection || 'System'} {log.targetRecordId ? `(${log.targetRecordId})` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground shrink-0 sm:text-right">
                  <span className="bg-muted px-2 py-1 rounded-md border border-border">Admin ID: {log.adminId}</span>
                  <span>{formatDistanceToNow(new Date(log.created), { addSuffix: true })}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminAccessControl>
  );
}
