import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Game Error Caught:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full bg-card border border-destructive/30 rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-2">Game Error</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error while running this game. Our systems have logged the issue.
            </p>
            
            {isDevelopment && this.state.error && (
              <div className="mb-6 text-left bg-muted p-4 rounded-lg overflow-auto max-h-32 text-xs font-mono text-muted-foreground border border-border">
                <p className="font-bold mb-2">Error Details:</p>
                <p>{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <>
                    <p className="font-bold mt-2 mb-1">Stack Trace:</p>
                    <p className="whitespace-pre-wrap text-[10px]">{this.state.errorInfo.componentStack}</p>
                  </>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground font-bold hover:bg-primary/90">
                <RefreshCw className="w-4 h-4 mr-2" /> Reload Game
              </Button>
              <Button asChild variant="outline" className="font-bold">
                <Link to="/"><Home className="w-4 h-4 mr-2" /> Return Home</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;