
import React from 'react';
import { MapPin } from 'lucide-react';

const LocationMap = () => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-border bg-card">
      <div className="p-6 border-b border-border flex items-center justify-between bg-card text-card-foreground">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-xl">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-xl">NICD PRODUCTIONS</h3>
            <p className="text-sm text-muted-foreground mt-0.5">600 Mamaroneck Ave Ste 400, Harrison, NY 10528</p>
          </div>
        </div>
        <a 
          href="https://www.google.com/maps/dir/?api=1&destination=600+Mamaroneck+Ave+Ste+400,+Harrison,+NY+10528" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline hidden sm:block bg-primary/5 px-4 py-2 rounded-lg transition-colors"
        >
          Get Directions
        </a>
      </div>
      <div className="w-full h-[450px] bg-muted relative">
        <iframe
          title="NICD PRODUCTIONS Location"
          src="https://maps.google.com/maps?q=600+Mamaroneck+Ave+Ste+400,+Harrison,+NY+10528&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        ></iframe>
      </div>
    </div>
  );
};

export default LocationMap;
