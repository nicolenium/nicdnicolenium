import React from 'react';
import ReactDom from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
 
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error ("Missing Publishable key from Clerk");
}

// Register Service Worker for offline support and caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      },
      (err) => {
        console.log('ServiceWorker registration failed: ', err);
      }
    );
  });
}

 ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
   <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
       <BrowserRouter>
        <ErrorBoundary>
         <App />
        </ErrorBoundary>
       </BrowserRouter>
     </ClerkProvider>
   </React.StrictMode>
 );
