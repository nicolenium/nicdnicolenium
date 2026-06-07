
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.jsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Download, X, FileText, ZoomIn, ZoomOut, Maximize, Minimize, Printer, Search, ChevronLeft, ChevronRight, RotateCcw, Monitor, Maximize2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const PAGE_SIZE = 2500; // Approximate characters per page chunk for text content

export default function DocumentViewer({ docData, isOpen, onClose }) {
  const { currentUser } = useAuth();
  
  // Verify admin access
  const isAdmin = currentUser?.role === 'admin' || 
                  currentUser?.role === 'super_admin' || 
                  currentUser?.collectionName === 'admin_users';

  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  
  const containerRef = useRef(null);

  // Split text content into manageable chunks to simulate pages
  const pages = useMemo(() => {
    const text = docData?.content || '';
    if (!text) return [''];
    const chunks = [];
    for (let i = 0; i < text.length; i += PAGE_SIZE) {
      chunks.push(text.slice(i, i + PAGE_SIZE));
    }
    return chunks;
  }, [docData?.content]);

  // Reset states when document changes
  useEffect(() => {
    if (isOpen) {
      setZoom(100);
      setSearchQuery('');
      setCurrentPage(0);
    }
  }, [isOpen, docData?.id]);

  // Track fullscreen changes globally
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      // Don't override if typing in an input
      if (document.activeElement.tagName === 'INPUT') return;

      switch(e.key) {
        case 'ArrowRight':
          setCurrentPage(p => Math.min(pages.length - 1, p + 1));
          break;
        case 'ArrowLeft':
          setCurrentPage(p => Math.max(0, p - 1));
          break;
        case '+':
        case '=':
          setZoom(z => Math.min(z + 20, 200));
          break;
        case '-':
        case '_':
          setZoom(z => Math.max(z - 20, 50));
          break;
        case '0':
          setZoom(100);
          break;
        case 'Escape':
          if (!isFullscreen) onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, pages.length, isFullscreen, onClose]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      toast.error("Fullscreen mode is not supported by your browser.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Popup blocked! Please allow popups to print documents.");
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${docData?.title || 'Document'}</title>
          <style>
            body { 
              font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; 
              line-height: 1.6; 
              padding: 40px; 
              color: #000;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 { margin-bottom: 8px; border-bottom: 2px solid #eee; padding-bottom: 16px; }
            .meta { color: #666; font-size: 0.9em; margin-bottom: 32px; text-transform: uppercase; letter-spacing: 1px; }
            .content { white-space: pre-wrap; font-size: 12pt; }
          </style>
        </head>
        <body>
          <h1>${docData?.title || 'Official Guide'}</h1>
          <div class="meta">
            ${docData?.category || 'Document'} • ${docData?.topic || docData?.section || 'Guide'}
          </div>
          <div class="content">${docData?.content || ''}</div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Slight delay to ensure content is fully rendered before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleDownload = async () => {
    if (!isAdmin) {
      toast.error("Administrator access required to download official documents.");
      return;
    }

    try {
      if (docData?.file) {
        // Direct file download using PocketBase
        const url = pb.files.getUrl(docData, docData.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = docData.title || 'document';
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        toast.success("Download started securely.");
      } else {
        // Fallback: Generate PDF client-side using jsPDF for text documents
        const { jsPDF } = await import('jspdf');
        const pdf = new jsPDF();
        
        pdf.setFontSize(22);
        pdf.setFont("helvetica", "bold");
        pdf.text(docData?.title || 'Document', 20, 25);
        
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(`${docData?.category || 'Category'} - ${docData?.topic || 'Topic'}`, 20, 35);
        
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        
        const lines = pdf.splitTextToSize(docData?.content || '', 170);
        let cursorY = 50;
        
        lines.forEach(line => {
          if (cursorY > 275) {
            pdf.addPage();
            cursorY = 25;
          }
          pdf.text(line, 20, cursorY);
          cursorY += 7;
        });
        
        pdf.save(`${(docData?.title || 'document').replace(/\s+/g, '_')}.pdf`);
        toast.success("PDF generated and downloaded successfully.");
      }
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to process download request.");
    }
  };

  // Escape regex to prevent invalid search patterns crashing the app
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const highlightedContent = useMemo(() => {
    const currentText = pages[currentPage] || '';
    if (!searchQuery) return currentText;
    
    try {
      const safeQuery = escapeRegExp(searchQuery);
      const regex = new RegExp(`(${safeQuery})`, 'gi');
      const parts = currentText.split(regex);
      
      return parts.map((part, i) => 
        regex.test(part) 
          ? <mark key={i} className="bg-primary/30 text-primary-foreground font-bold px-1 rounded shadow-sm">{part}</mark> 
          : part
      );
    } catch (e) {
      return currentText;
    }
  }, [pages, currentPage, searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent 
        ref={containerRef}
        className="max-w-[100vw] w-full max-h-[100vh] h-full md:max-w-[95vw] md:h-[95vh] md:rounded-2xl p-0 flex flex-col overflow-hidden bg-background border-border shadow-2xl transition-all duration-300"
      >
        <VisuallyHidden><DialogTitle>{docData?.title || 'Document Viewer'}</DialogTitle></VisuallyHidden>
        
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-card border-b border-border shrink-0 gap-4 z-10 relative shadow-sm">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 border border-primary/20">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-foreground text-lg leading-tight truncate">{docData?.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold bg-muted px-2 py-0.5 rounded">
                  {docData?.category || 'Document'}
                </span>
                <span className="text-[10px] text-primary uppercase tracking-widest font-bold bg-primary/10 px-2 py-0.5 rounded">
                  {docData?.topic || docData?.section || 'Guide'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
            <div className="relative min-w-[150px] flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Search text..." 
                className="h-10 pl-9 bg-muted/50 rounded-xl border-border text-sm font-medium focus-visible:bg-background transition-colors"
              />
            </div>

            <div className="flex items-center bg-muted/50 rounded-xl border border-border overflow-hidden shrink-0 h-10">
              <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.max(z - 20, 50))} className="h-full w-10 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground" title="Zoom Out"><ZoomOut className="w-4 h-4" /></Button>
              <span className="text-xs font-bold w-12 text-center select-none text-foreground">{zoom}%</span>
              <Button variant="ghost" size="icon" onClick={() => setZoom(z => Math.min(z + 20, 200))} className="h-full w-10 rounded-none hover:bg-muted border-r border-border text-muted-foreground hover:text-foreground" title="Zoom In"><ZoomIn className="w-4 h-4" /></Button>
              
              <div className="w-px h-full bg-border"></div>
              
              <Button variant="ghost" size="icon" onClick={() => setZoom(100)} className="h-full w-10 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground" title="Fit to Page"><Maximize2 className="w-3.5 h-3.5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setZoom(150)} className="h-full w-10 rounded-none hover:bg-muted text-muted-foreground hover:text-foreground" title="Fit to Width"><Monitor className="w-3.5 h-3.5" /></Button>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button variant="outline" size="icon" onClick={handlePrint} className="h-10 w-10 rounded-xl border-2" title="Print Document">
                <Printer className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={toggleFullscreen} className="h-10 w-10 rounded-xl border-2 hidden md:flex" title="Toggle Fullscreen">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
              
              {isAdmin && (
                <Button onClick={handleDownload} className="h-10 px-4 rounded-xl font-bold ml-1 shadow-glow-primary bg-primary text-primary-foreground">
                  <Download className="w-4 h-4 mr-2" /> <span className="hidden lg:inline">Download</span>
                </Button>
              )}
              
              <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 rounded-full hover:bg-destructive/10 hover:text-destructive ml-1">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Document Content Area */}
        <div className="flex-1 overflow-auto bg-[#e5e7eb] dark:bg-[#0a0a0a] relative p-4 md:p-8 flex flex-col items-center">
          <div 
            className="w-full max-w-4xl bg-white dark:bg-card text-black dark:text-card-foreground shadow-xl border border-border p-8 md:p-14 lg:p-20 rounded-xl md:rounded-2xl transition-all origin-top min-h-[80vh] flex flex-col"
            style={{ 
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              marginBottom: `${(zoom > 100 ? (zoom - 100) : 0)}%` // Prevent clipping when scaled up
            }}
          >
            <div className="text-center mb-12 border-b border-gray-200 dark:border-border pb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black mb-4 leading-tight">
                {docData?.title}
              </h1>
              <p className="text-sm uppercase tracking-widest font-bold text-gray-500 dark:text-muted-foreground flex items-center justify-center gap-3">
                <span>{docData?.difficulty || 'General'} Level</span>
                <span>•</span>
                <span>{docData?.language || 'English'}</span>
              </p>
            </div>
            
            <div className="whitespace-pre-wrap font-serif leading-relaxed text-lg flex-1 text-balance">
              {highlightedContent || (
                 <div className="text-center text-muted-foreground italic py-20 flex flex-col items-center">
                    <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
                    Content is empty or failed to load.
                 </div>
              )}
            </div>

            {/* Pagination Controls inside document visually */}
            {pages.length > 1 && (
              <div className="flex items-center justify-between mt-16 pt-6 border-t border-gray-200 dark:border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                  disabled={currentPage === 0}
                  className="rounded-full font-bold border-2"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous Page
                </Button>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-muted-foreground">
                  Page {currentPage + 1} of {pages.length}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))} 
                  disabled={currentPage === pages.length - 1}
                  className="rounded-full font-bold border-2"
                >
                  Next Page <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
