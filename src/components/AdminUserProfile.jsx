
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, KeyRound, Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.jsx";

export default function AdminUserProfile() {
  const { currentAdmin, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20">
            <span className="text-sm font-bold text-primary">{getInitials(currentAdmin?.name || currentAdmin?.email)}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60 bg-card border-border shadow-2xl p-2 rounded-xl mt-2">
          <DropdownMenuLabel className="p-2">
            <div className="flex flex-col space-y-1.5">
              <p className="text-sm font-bold leading-none text-foreground flex items-center gap-2">
                {currentAdmin?.name || 'Administrator'}
                <Shield className="w-3 h-3 text-primary" />
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {currentAdmin?.email || 'admin@nicd.com'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border my-1" />
          <DropdownMenuItem className="p-2 cursor-pointer font-medium hover:text-primary focus:bg-muted rounded-md transition-colors" onClick={() => navigate('/admin/profile')}>
            <User className="w-4 h-4 mr-3 text-muted-foreground" /> 
            Profile Details
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2 cursor-pointer font-medium hover:text-primary focus:bg-muted rounded-md transition-colors" onClick={() => navigate('/admin/settings')}>
            <Settings className="w-4 h-4 mr-3 text-muted-foreground" /> 
            Platform Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2 cursor-pointer font-medium hover:text-primary focus:bg-muted rounded-md transition-colors" onClick={() => navigate('/admin/profile?tab=security')}>
            <KeyRound className="w-4 h-4 mr-3 text-muted-foreground" /> 
            Change Password
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border my-1" />
          <DropdownMenuItem 
            className="p-2 cursor-pointer font-bold text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive rounded-md transition-colors" 
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-4 h-4 mr-3" /> 
            Secure Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">End Admin Session?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will log you out of the administrative portal. You will need your credentials to access these features again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-border hover:bg-muted text-foreground font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold" onClick={handleLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
