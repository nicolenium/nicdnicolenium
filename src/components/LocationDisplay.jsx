
import React from 'react';
import { MapPin } from 'lucide-react';

export default function LocationDisplay({ locationStr = "New York, US", timezone = "EST (GMT-5)" }) {
  // Simplified location display that doesn't rely on external map scripts that might fail
  return (
    <div className="flex flex-col h-full bg-card border-l border-border shadow-2xl w-full sm:w-80 absolute right-0 top-0 bottom-0 z-40 animate-in slide-in-from-right-8">
      <div className="p-4 border-b border-border flex items-center bg-muted/30">
        <MapPin className="w-5 h-5 mr-2 text-primary" />
        <h3 className="font-bold text-lg tracking-tight">Location</h3>
      </div>
      
      <div className="flex-1 p-6 flex flex-col gap-6">
        <div className="bg-muted/50 rounded-xl p-4 border border-border text-center">
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">Current Location</p>
          <p className="text-xl font-black">{locationStr}</p>
        </div>

        <div className="bg-muted/50 rounded-xl p-4 border border-border text-center">
          <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider mb-1">Local Timezone</p>
          <p className="text-lg font-bold">{timezone}</p>
          <p className="text-2xl font-mono mt-2 text-primary">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>

        <div className="flex-1 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center relative">
           <iframe 
             title="Map view"
             width="100%" 
             height="100%" 
             frameBorder="0" 
             scrolling="no" 
             marginHeight="0" 
             marginWidth="0" 
             src={`https://www.openstreetmap.org/export/embed.html?bbox=-74.0060,40.7128,-74.0060,40.7128&layer=mapnik&marker=40.7128,-74.0060`}
             className="absolute inset-0 grayscale opacity-80"
           ></iframe>
        </div>
      </div>
    </div>
  );
}
