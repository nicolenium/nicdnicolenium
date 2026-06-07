
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.jsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { User, Settings, LogOut } from 'lucide-react';

export default function AdminProfileMenu() {
  const { adminUser, adminLogout } = useAdminAuth();
  const navigate = useNavigate();

  if (!adminUser) return null;

  const avatarUrl = adminUser.avatar 
    ? pb.files.getUrl(adminUser, adminUser.avatar) 
    : '';
    
  const initials = adminUser.name 
    ? adminUser.name.substring(0, 2).toUpperCase() 
    : adminUser.email.substring(0, 2).toUpperCase();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-primary rounded-full transition-transform active:scale-95">
        <Avatar className="w-10 h-10 border-2 border-white/10 hover:border-primary/50 transition-colors">
          <AvatarImage src={avatarUrl} alt={adminUser.name || 'Admin'} className="object-cover" />
          <AvatarFallback className="bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-slate-950 border-white/10 text-slate-200 shadow-2xl">
        <DropdownMenuLabel className="flex items-center gap-3 p-3">
          <Avatar className="w-10 h-10 border border-white/10">
            <AvatarImage src={avatarUrl} alt={adminUser.name || 'Admin'} className="object-cover" />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold truncate">{adminUser.name || 'Administrator'}</span>
            <span className="text-xs text-muted-foreground truncate">{adminUser.email}</span>
            <span className="text-[10px] text-primary mt-0.5 opacity-70">ID: {adminUser.id}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-white/5 focus:bg-white/5 py-2.5"
          onClick={() => navigate('/admin/profile')}
        >
          <User className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-white/5 focus:bg-white/5 py-2.5"
          onClick={() => navigate('/admin/settings')}
        >
          <Settings className="w-4 h-4 mr-2 text-muted-foreground" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive py-2.5"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Secure Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
