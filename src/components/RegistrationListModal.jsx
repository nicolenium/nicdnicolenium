
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const RegistrationListModal = ({ isOpen, onClose, tournamentId, tournamentName }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && tournamentId) {
      fetchRegistrations();
    }
  }, [isOpen, tournamentId]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const records = await pb.collection('tournament_registrations').getFullList({
        filter: `tournamentId = "${tournamentId}"`,
        sort: '-created',
        $autoCancel: false
      });
      setRegistrations(records);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Experience Level', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...registrations.map(r => [
        `"${r.player_name}"`,
        `"${r.email}"`,
        `"${r.phone || ''}"`,
        `"${r.experience_level}"`,
        `"${new Date(r.created).toLocaleDateString()}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${tournamentName.replace(/\s+/g, '_')}_registrations.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Registrations: {tournamentName}</DialogTitle>
          <DialogDescription>
            Total registered players: {registrations.length}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={exportToCSV} disabled={registrations.length === 0 || loading}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="flex-1 overflow-auto border rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : registrations.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No registrations found for this tournament.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-medium">{reg.player_name}</TableCell>
                    <TableCell>{reg.email}</TableCell>
                    <TableCell>{reg.phone || '-'}</TableCell>
                    <TableCell>{reg.experience_level}</TableCell>
                    <TableCell>{new Date(reg.created).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationListModal;
