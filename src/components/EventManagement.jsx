
import React, { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { Loader2, Plus, Edit, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '', name: '', description: '', event_type: 'other', participant_limit: 100, 
    status: 'draft', start_date: '', time: '', location: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('events').getFullList({ sort: '-created', $autoCancel: false });
      setEvents(records);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (evt = null) => {
    if (evt) {
      setFormData({
        id: evt.id, name: evt.name || '', description: evt.description || '', 
        event_type: evt.event_type || 'other', participant_limit: evt.participant_limit || 100,
        status: evt.status || 'draft', start_date: evt.start_date ? evt.start_date.substring(0, 10) : '',
        time: evt.time || '', location: evt.location || ''
      });
    } else {
      setFormData({
        id: '', name: '', description: '', event_type: 'other', participant_limit: 100, 
        status: 'draft', start_date: '', time: '', location: ''
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('event_type', formData.event_type);
      data.append('participant_limit', formData.participant_limit);
      data.append('status', formData.status);
      data.append('time', formData.time);
      data.append('location', formData.location);
      if (formData.start_date) data.append('start_date', new Date(formData.start_date).toISOString());
      if (imageFile) data.append('image', imageFile);

      if (formData.id) {
        await pb.collection('events').update(formData.id, data, { $autoCancel: false });
        toast.success('Event updated successfully');
      } else {
        data.append('createdBy', pb.authStore.model.id);
        await pb.collection('events').create(data, { $autoCancel: false });
        toast.success('Event created successfully');
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save event');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await pb.collection('events').delete(id, { $autoCancel: false });
        toast.success('Event deleted');
        fetchEvents();
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete event');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl shadow-sm border border-border">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2"><Calendar className="text-primary w-6 h-6"/> Events</h2>
          <p className="text-muted-foreground mt-1">Manage community events and gatherings</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="bg-primary text-primary-foreground shadow-md transition-transform active:scale-95">
          <Plus className="w-4 h-4 mr-2" /> New Event
        </Button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card text-card-foreground border-border">
          <DialogTitle className="text-xl font-bold">{formData.id ? 'Edit Event' : 'Create Event'}</DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Name</label>
                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Event Type</label>
                <Select value={formData.event_type} onValueChange={v => setFormData({...formData, event_type: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tournament">Tournament</SelectItem>
                    <SelectItem value="challenge">Challenge</SelectItem>
                    <SelectItem value="league">League</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Date</label>
                <Input type="date" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Time</label>
                <Input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Capacity</label>
                <Input type="number" value={formData.participant_limit} onChange={e => setFormData({...formData, participant_limit: e.target.value})} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Status</label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-background text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Location</label>
              <Input placeholder="Address or Link" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="bg-background text-foreground" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Description</label>
              <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-background text-foreground min-h-[80px]" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Event Banner</label>
              <Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="bg-background text-foreground cursor-pointer" />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground">
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Save Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold text-foreground">Event</TableHead>
                <TableHead className="font-bold text-foreground">Type</TableHead>
                <TableHead className="font-bold text-foreground">Date / Time</TableHead>
                <TableHead className="font-bold text-foreground">Location</TableHead>
                <TableHead className="font-bold text-foreground">Status</TableHead>
                <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No events found</TableCell></TableRow>
              ) : (
                events.map((e) => (
                  <TableRow key={e.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="capitalize">{e.event_type}</TableCell>
                    <TableCell>{e.start_date ? new Date(e.start_date).toLocaleDateString() : ''} {e.time && `• ${e.time}`}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{e.location}</TableCell>
                    <TableCell>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        e.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {e.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenModal(e)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(e.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default EventManagement;
