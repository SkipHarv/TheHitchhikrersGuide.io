import React, { useState, useEffect, useCallback } from 'react';
import { Screen } from './types.ts';
import HomeScreen from './components/HomeScreen.tsx';
import SearchScreen from './components/SearchScreen.tsx';
import MediaLibraryScreen from './components/MediaLibraryScreen.tsx';
import WarningScreen from './components/WarningScreen.tsx';
import SystemScreen from './components/SystemScreen.tsx';

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
      if (e.key === 'Enter') {
        handleStart();
      }
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

  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventContextMenu);
    return () => document.removeEventListener('contextmenu', preventContextMenu);
  }, []);

  useEffect(() => {
    if (!isStarted) return;
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      const { key, code } = event;
      const match = key.match(/[1-5]/) || code.match(/[1-5]/);
      if (match) {
        const num = match[0];
        event.stopImmediatePropagation();
        event.preventDefault();
        if (num === '1') changeScreen(Screen.Home);
        else if (num === '2') changeScreen(Screen.Search);
        else if (num === '3') changeScreen(Screen.MediaLibrary);
        else if (num === '4') changeScreen(Screen.Warning);
        else if (num === '5') changeScreen(Screen.System);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, true);
  }, [changeScreen, isStarted]);
  
  const renderScreenComponent = () => {
    switch (currentScreen) {
      case Screen.Home: return <HomeScreen key="home" />;
      case Screen.Search: return <SearchScreen key="search" />;
      case Screen.MediaLibrary: return <MediaLibraryScreen key="media" />;
      case Screen.Warning: return <WarningScreen key="warning" />;
      case Screen.System: return <SystemScreen key="system" />;
      default: return <HomeScreen key="home-default" />;
    }
  };

  const getScreenName = (screen: Screen) => {
    switch (screen) {
      case Screen.Home: return "CORE_LOGIC";
      case Screen.Search: return "SUB_ETHER_SEARCH";
      case Screen.MediaLibrary: return "MEDIA_VAULT";
      case Screen.Warning: return "CRITICAL_HAZARD";
      case Screen.System: return "KERNEL_SHELL";
      default: return "UNKNOWN";
    }
  };

  if (!isStarted) {
    return (
      <div className="screen splash-screen" onClick={handleStart} style={{ cursor: 'pointer' }}>
        <div className="crt-global-overlay"></div>
        <div className="crt-global-scanline"></div>
        <h1 className="splash-title">The Hitchhiker's Guide to the Galaxy</h1>
        <p className="publisher-text">Megadodo Publications of Ursa Minor</p>
        <p className="halt-text">[ SYSTEM HALTED. PRESS ENTER OR CLICK TO BOOT ]</p>
        <button className="start-button" aria-label="Boot System">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="50" cy="55" r="32" />
            <ellipse cx="50" cy="55" rx="46" ry="12" transform="rotate(-30 50 55)" />
          </svg>
        </button>
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