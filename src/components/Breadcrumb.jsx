
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function Breadcrumb({ className }) {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Helper to format path segments into readable text
  const formatPathSegment = (segment) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav aria-label="breadcrumb" className={cn("flex items-center text-sm text-muted-foreground py-4", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            to="/" 
            className="flex items-center hover:text-primary transition-colors duration-200"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight className="w-4 h-4 opacity-50 shrink-0" />
              {isLast ? (
                <span className="font-bold text-foreground truncate max-w-[200px] sm:max-w-none" aria-current="page">
                  {formatPathSegment(value)}
                </span>
              ) : (
                <Link 
                  to={to} 
                  className="hover:text-primary transition-colors duration-200 truncate max-w-[150px] sm:max-w-none"
                >
                  {formatPathSegment(value)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
