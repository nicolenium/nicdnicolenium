
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog.jsx';
import { Search, Edit2, ShieldAlert, KeyRound, Trash2, Loader2, UserCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function PlayerManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let filterStr = [];
      if (searchQuery) {
        filterStr.push(`(name ~ "${searchQuery}" || email ~ "${searchQuery}" || username ~ "${searchQuery}")`);
      }
      if (statusFilter !== 'all') {
        filterStr.push(`status = "${statusFilter}"`);
      }

      const records = await pb.collection('users').getList(page, 15, {
        filter: filterStr.join(' && '),
        sort: '-created',
        $autoCancel: false
      });
      setUsers(records.items);
      setTotalPages(records.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleEdit = (user) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await pb.collection('users').update(selectedUser.id, {
        name: selectedUser.name,
        username: selectedUser.username,
        status: selectedUser.status || 'active'
      }, { $autoCancel: false });
      toast.success('User updated successfully');
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBanToggle = async (user) => {
    const newStatus = user.status === 'banned' ? 'active' : 'banned';
    if (!window.confirm(`Are you sure you want to ${newStatus === 'banned' ? 'ban' : 'unban'} ${user.username}?`)) return;
    try {
      await pb.collection('users').update(user.id, { status: newStatus }, { $autoCancel: false });
      toast.success(`User ${newStatus === 'banned' ? 'banned' : 'unbanned'} successfully`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`CRITICAL: Are you sure you want to permanently delete user ${user.username}? This action cannot be undone.`)) return;
    try {
      await pb.collection('users').delete(user.id, { $autoCancel: false });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleResetPassword = async (email) => {
    try {
      await pb.collection('users').requestPasswordReset(email, { $autoCancel: false });
      toast.success('Password reset email sent to user');
    } catch (err) {
      toast.error('Failed to send reset email');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <span className="admin-badge admin-badge-success">Active</span>;
      case 'banned': return <span className="admin-badge admin-badge-danger">Banned</span>;
      case 'inactive': return <span className="admin-badge admin-badge-neutral">Inactive</span>;
      default: return <span className="admin-badge admin-badge-success">Active</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 admin-card p-6">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2"><UserCircle className="text-blue-500 w-6 h-6"/> User Management</h1>
          <p className="text-muted-foreground mt-1">Manage player accounts and access</p>
        </div>
      </div>

      <div className="admin-table-container p-4 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, email, or username..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background border-border" 
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-background">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="admin-table-container">
        {loading && users.length === 0 ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader className="admin-table-header">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No users found.</TableCell></TableRow>
              ) : (
                users.map(u => (
                  <TableRow key={u.id} className="admin-table-row">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                          {u.avatar ? <img src={pb.files.getUrl(u, u.avatar)} alt={u.username} className="w-full h-full object-cover" /> : <UserCircle className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <div className="font-bold text-foreground">{u.name || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">@{u.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(u.created).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(u.status || 'active')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="View Profile" onClick={() => handleView(u)}><Eye className="w-4 h-4 text-muted-foreground" /></Button>
                        <Button variant="ghost" size="icon" title="Edit User" onClick={() => handleEdit(u)}><Edit2 className="w-4 h-4 text-blue-500" /></Button>
                        <Button variant="ghost" size="icon" title="Reset Password" onClick={() => handleResetPassword(u.email)}><KeyRound className="w-4 h-4 text-amber-500" /></Button>
                        <Button variant="ghost" size="icon" title={u.status === 'banned' ? 'Unban User' : 'Ban User'} onClick={() => handleBanToggle(u)}>
                          <ShieldAlert className={`w-4 h-4 ${u.status === 'banned' ? 'text-success' : 'text-danger'}`} />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete User" onClick={() => handleDelete(u)}><Trash2 className="w-4 h-4 text-danger" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <span className="flex items-center px-4 text-sm font-medium">Page {page} of {totalPages}</span>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-card text-card-foreground border-border sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details. Note: Emails cannot be changed directly here for security reasons.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleSaveEdit} className="space-y-4 py-4">
              <div className="admin-input-group">
                <label className="admin-label">Full Name</label>
                <Input value={selectedUser.name || ''} onChange={e => setSelectedUser({...selectedUser, name: e.target.value})} className="bg-background" />
              </div>
              <div className="admin-input-group">
                <label className="admin-label">Username</label>
                <Input value={selectedUser.username || ''} onChange={e => setSelectedUser({...selectedUser, username: e.target.value})} className="bg-background" />
              </div>
              <div className="admin-input-group">
                <label className="admin-label">Status</label>
                <Select value={selectedUser.status || 'active'} onValueChange={v => setSelectedUser({...selectedUser, status: v})}>
                  <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save Changes'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Profile Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-card text-card-foreground border-border">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar ? <img src={pb.files.getUrl(selectedUser, selectedUser.avatar)} alt="Avatar" className="w-full h-full object-cover"/> : <UserCircle className="w-8 h-8 text-muted-foreground" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name || selectedUser.username}</h3>
                  <p className="text-sm text-muted-foreground">@{selectedUser.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="admin-label">Email:</span> <p className="font-medium">{selectedUser.email}</p></div>
                <div><span className="admin-label">ID:</span> <p className="font-mono text-xs mt-1">{selectedUser.id}</p></div>
                <div><span className="admin-label">Joined:</span> <p className="font-medium">{new Date(selectedUser.created).toLocaleDateString()}</p></div>
                <div><span className="admin-label">Status:</span> <div className="mt-1">{getStatusBadge(selectedUser.status || 'active')}</div></div>
                <div className="col-span-2"><span className="admin-label">Bio:</span> <p className="font-medium mt-1">{selectedUser.bio || 'No bio provided.'}</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
