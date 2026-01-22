
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Prevent default PWA install behavior for a cleaner kiosk experience
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
});

// Optimized Service Worker registration for local hosting
// Fixed: Property 'env' does not exist on type 'ImportMeta' by using type assertion for Vite's import.meta.env
if ('serviceWorker' in navigator && (import.meta as any).env?.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration.scope);
      })
      .catch(registrationError => {
        console.warn('SW registration failed: ', registrationError);
      });
  });
} else if ('serviceWorker' in navigator) {
  // During local development, we unregister existing workers to avoid stale code
  navigator.serviceWorker.getRegistrations().then(registrations => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
