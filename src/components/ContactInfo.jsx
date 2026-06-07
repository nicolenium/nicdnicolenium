
import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function ContactInfo() {
  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-lg h-full">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Contact Information</h3>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-foreground mb-1">NICD PRODUCTIONS LLC</h4>
            <p className="text-muted-foreground leading-relaxed">600 Mamaroneck Ave<br/>STE 400<br/>Harrison NY 10528</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-foreground mb-1">Phone</h4>
            <a href="tel:5167547113" className="text-muted-foreground hover:text-primary transition-colors">516-754-7113</a>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-foreground mb-1">Email</h4>
            <div className="flex flex-col space-y-2">
              <a href="mailto:contact@nicdnicolenium.com" className="text-muted-foreground hover:text-primary transition-colors">contact@nicdnicolenium.com</a>
              <a href="mailto:nicolenium@nicdproductions.com" className="text-muted-foreground hover:text-primary transition-colors">nicolenium@nicdproductions.com</a>
              <a href="mailto:nicd@nicolenium.com" className="text-muted-foreground hover:text-primary transition-colors">nicd@nicolenium.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
