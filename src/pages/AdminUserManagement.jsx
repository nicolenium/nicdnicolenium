
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, Shield, Search, MoreVertical, Ban, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';
import AdminAccessControl, { PERMISSIONS } from '@/components/AdminAccessControl.jsx';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('users').getList(1, 50, {
        sort: '-created',
        $autoCancel: false
      });
      setUsers(records.items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, user) => {
    try {
      if (action === 'delete') {
        if(!window.confirm(`Delete user ${user.username}?`)) return;
        await pb.collection('users').delete(user.id, { $autoCancel: false });
        toast.success("User deleted");
        fetchUsers();
      } else if (action === 'ban') {
        await pb.collection('users').update(user.id, { status: 'banned' }, { $autoCancel: false });
        toast.success("User banned");
        fetchUsers();
      }
    } catch (err) {
      toast.error(`Action failed: ${err.message}`);
    }
  };

  return (
    <AdminAccessControl requiredRoles={PERMISSIONS.ADMIN}>
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
        <Helmet><title>User Management | Admin</title></Helmet>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" /> User Management
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Manage platform players, roles, and access control.</p>
          </div>
          <Button className="h-12 px-6 rounded-xl font-bold shadow-glow-primary"><Shield className="w-4 h-4 mr-2" /> Add Admin</Button>
        </div>

        <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 h-10 border-2 rounded-lg bg-background"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr><td colSpan="5" className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : users.map(user => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center font-bold text-primary">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${user.status === 'banned' ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-muted-foreground">{new Date(user.created).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><MoreVertical className="w-4 h-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                          <DropdownMenuLabel className="font-bold text-xs uppercase text-muted-foreground">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem className="font-medium cursor-pointer" onClick={() => toast.info("Edit UI not implemented in stub")}><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</DropdownMenuItem>
                          <DropdownMenuItem className="font-medium cursor-pointer text-amber-500 focus:text-amber-500" onClick={() => handleAction('ban', user)}><Ban className="w-4 h-4 mr-2" /> Suspend User</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-border" />
                          <DropdownMenuItem className="font-bold cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => handleAction('delete', user)}><Trash2 className="w-4 h-4 mr-2" /> Delete Account</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminAccessControl>
  );
}
