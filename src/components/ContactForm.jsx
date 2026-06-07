
import React, { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await pb.collection('contact_submissions').create(formData, { $autoCancel: false });
      toast.success("Message sent successfully! We will get back to you soon.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error("Contact submission error:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl h-full">
      <h3 className="text-2xl font-bold mb-6 text-foreground font-serif">Send us a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Full Name *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="h-12 bg-background border-2" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Email Address *</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="h-12 bg-background border-2" placeholder="john@example.com" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className="h-12 bg-background border-2" placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Subject *</Label>
            <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} className="h-12 bg-background border-2" placeholder="How can we help?" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="message" className="text-muted-foreground font-bold uppercase tracking-wider text-xs">Message *</Label>
          <Textarea id="message" name="message" value={formData.message} onChange={handleChange} className="min-h-[150px] bg-background border-2 resize-y" placeholder="Write your message here..." required />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-primary transition-all">
          {isSubmitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Sending...</> : <><Send className="w-5 h-5 mr-2" /> Send Message</>}
        </Button>
      </form>
    </div>
  );
}
