
import React, { useState, useEffect } from 'react';
import { MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command.jsx';

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Japan", "Brazil", "India", "Spain", "Italy", "Mexico", 
  "South Korea", "Netherlands", "Sweden", "Switzerland", "Singapore"
].sort();

export default function LocationButton() {
  const [location, setLocation] = useState('Set Location');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nicd_user_location');
    if (saved) setLocation(saved);
  }, []);

  const handleSelect = (country) => {
    setLocation(country);
    localStorage.setItem('nicd_user_location', country);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2 text-muted-foreground hover:text-primary font-bold transition-colors">
          <MapPin className="w-4 h-4" />
          <span className="max-w-[120px] truncate">{location}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-2 border-border rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" /> Select Region
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Command className="border rounded-2xl bg-muted/20">
            <CommandInput placeholder="Search countries..." className="font-medium" />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRIES.map((country) => (
                  <CommandItem
                    key={country}
                    value={country}
                    onSelect={() => handleSelect(country)}
                    className="font-medium cursor-pointer py-3"
                  >
                    <Check className={`mr-2 h-4 w-4 ${location === country ? "opacity-100 text-primary" : "opacity-0"}`} />
                    {country}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
}
