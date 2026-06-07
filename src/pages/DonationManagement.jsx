
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';

export default function DonationManagement() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black font-serif uppercase tracking-wider">Donations Ledger</h1>
      <div className="bg-card border border-white/10 rounded-2xl shadow-xl overflow-hidden p-6 text-center">
        <h3 className="text-4xl font-black text-primary mb-2">$14,250.00</h3>
        <p className="text-muted-foreground uppercase text-sm font-bold tracking-wider mb-8">Total Contributions</p>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10">
              <TableHead>Donor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-white/10">
              <TableCell className="font-bold">Anonymous</TableCell>
              <TableCell className="text-primary font-mono font-bold">$500.00</TableCell>
              <TableCell className="text-muted-foreground">Today</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
