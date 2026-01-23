import React, { useState, useEffect, useCallback } from 'react';
import { Screen } from './types';
import HomeScreen from './components/HomeScreen';
import SearchScreen from './components/SearchScreen';
import MediaLibraryScreen from './components/MediaLibraryScreen';
import WarningScreen from './components/WarningScreen';
import SystemScreen from './components/SystemScreen';

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem('hhgttg_screen');
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      return Object.values(Screen).includes(parsed) ? (parsed as Screen) : Screen.Home;
    }
    return Screen.Home;
  });

  // 1. Service Worker Registration for PWA Installation
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      window.addEventListener('load', () => {
        // Use the full repo path for the service worker
        navigator.serviceWorker.register('/TheHitchhikrersGuide.io/service-worker.js')
          .then(reg => console.log('SW registered:', reg))
          .catch(err => console.error('SW registration failed:', err));
      });
    }
  }, []);

  // CRT Effects Configuration
  useEffect(() => {
    const intensity = localStorage.getItem('hhgttg_crt_intensity') || '0.15';
    const speed = localStorage.getItem('hhgttg_crt_speed') || '10';
    document.documentElement.style.setProperty('--crt-intensity', intensity);
    document.documentElement.style.setProperty('--crt-speed', `${speed}s`);
  }, []);

  const handleStart = useCallback(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
    setIsStarted(true);
  }, []);

  // Keyboard boot listener
  useEffect(() => {
    if (isStarted) return;
    const handleBootKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleStart();
    };
    window.addEventListener('keydown', handleBootKey);
    return () => window.removeEventListener('keydown', handleBootKey);
  }, [isStarted, handleStart]);

  const changeScreen = useCallback((newScreen: Screen) => {
    setCurrentScreen(prev => {
      if (prev !== newScreen) {
        localStorage.setItem('hhgttg_screen', newScreen.toString());
        return newScreen;
      }
      return prev;
    });
  }, []);

  // Prevent context menu (Guide aesthetic)
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  // Global Keyboard Navigation
  useEffect(() => {
    if (!isStarted) return;
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const { key, code } = event;
      const match = key.match(/[1-5]/) || code.match(/[1-5]/);
      if (match) {
        const num = match[0];
        event.stopImmediatePropagation();
        event.preventDefault();
        const screenMap: Record<string, Screen> = {
          '1': Screen.Home,
          '2': Screen.Search,
          '3': Screen.MediaLibrary,
          '4': Screen.Warning,
          '5': Screen.System
        };
        if (screenMap[num]) changeScreen(screenMap[num]);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [changeScreen, isStarted]);
  
  const renderScreenComponent = () => {
    const props = { key: currentScreen };
    switch (currentScreen) {
      case Screen.Home: return <HomeScreen {...props} />;
      case Screen.Search: return <SearchScreen {...props} />;
      case Screen.MediaLibrary: return <MediaLibraryScreen {...props} />;
      case Screen.Warning: return <WarningScreen {...props} />;
      case Screen.System: return <SystemScreen {...props} />;
      default: return <HomeScreen {...props} />;
    }
  };

  const getScreenName = (screen: Screen) => {
    const names: Record<Screen, string> = {
      [Screen.Home]: "CORE_LOGIC",
      [Screen.Search]: "SUB_ETHER_SEARCH",
      [Screen.MediaLibrary]: "MEDIA_VAULT",
      [Screen.Warning]: "CRITICAL_HAZARD",
      [Screen.System]: "KERNEL_SHELL"
    };
    return names[screen] || "UNKNOWN";
  };

  if (!isStarted) {
    return (
      <div className="screen splash-screen" onClick={handleStart} style={{ cursor: 'pointer' }}>
        <div className="crt-global-overlay"></div>
        <div className="crt-global-scanline"></div>
        <h1 className="splash-title">The Hitchhiker's Guide to the Galaxy</h1>
        <p className="publisher-text">Megadodo Publications of Ursa Minor</p>
        <p className="halt-text">[ SYSTEM HALTED. PRESS ENTER OR CLICK TO BOOT ]</p>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="crt-global-overlay"></div>
      <div className="crt-global-scanline"></div>
      <div className="status-bar">
        <div>OS: HHGTTG-STABLE v42.0.6-pi</div>
        <div style={{color: 'var(--yellow)'}}>MOD: {getScreenName(currentScreen)}</div>
        <div>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      </div>
      <div className="animate-fade-in" style={{ width: '100%', height: '100%' }}>
        {renderScreenComponent()}
      </div>
    </div>
  );
};

export default App;
