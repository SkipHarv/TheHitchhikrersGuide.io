import React, { useState, useEffect, useCallback } from 'react';
import { MediaItem } from '../types';
import VideoPlayer from './VideoPlayer';

const DB_NAME = 'GuideDB';
const STORE_NAME = 'Settings';
const KEY_HANDLE = 'last_dir_handle';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveHandle = async (handle: any) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(handle, KEY_HANDLE);
};

const getSavedHandle = async (): Promise<any | null> => {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(KEY_HANDLE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
};

const MOCK_MEDIA: MediaItem[] = [
  { id: 1, title: 'Welcome to the Guide.mp4', format: 'MP4', src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
];

const MediaLibraryScreen: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>(MOCK_MEDIA);
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const saved = localStorage.getItem('hhgttg_media_index');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [playingVideoSrc, setPlayingVideoSrc] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [rememberedHandle, setRememberedHandle] = useState<any | null>(null);

  const processDirectory = useCallback(async (directoryHandle: any) => {
    setIsSyncing(true);
    try {
      const options = { mode: 'read' as const };
      if ((await directoryHandle.requestPermission(options)) !== 'granted') throw new Error("Permission denied.");
      await saveHandle(directoryHandle);
      setRememberedHandle(directoryHandle);
      const foundItems: MediaItem[] = [];
      let count = 0;
      for await (const entry of directoryHandle.values()) {
        if (entry.kind === 'file') {
          const file = await entry.getFile();
          if (file.type.startsWith('video/') || /\.(mp4|mkv|webm)$/i.test(file.name)) {
            count++;
            foundItems.push({ id: Date.now() + count, title: file.name, format: file.name.split('.').pop()?.toUpperCase() || 'UNK', src: URL.createObjectURL(file) });
          }
        }
      }
      if (foundItems.length > 0) setMediaList(foundItems);
    } catch (error) { console.error(error); } finally { setIsSyncing(false); }
  }, []);

  const syncFiles = useCallback(async () => {
    try {
      // @ts-ignore
      const directoryHandle = await window.showDirectoryPicker();
      await processDirectory(directoryHandle);
    } catch (error: any) { if (error.name !== 'AbortError') console.error(error); }
  }, [processDirectory]);

  useEffect(() => {
    getSavedHandle().then(handle => { if (handle) { setRememberedHandle(handle); processDirectory(handle); } });
  }, [processDirectory]);

  useEffect(() => { localStorage.setItem('hhgttg_media_index', selectedIndex.toString()); }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (playingVideoSrc || isSyncing) return;
      switch (e.key) {
        case 'ArrowUp': setSelectedIndex(prev => (prev - 1 + mediaList.length) % mediaList.length); break;
        case 'ArrowDown': setSelectedIndex(prev => (prev + 1) % mediaList.length); break;
        case 'Enter': if (mediaList[selectedIndex]) setPlayingVideoSrc(mediaList[selectedIndex].src); break;
        case 'n': case 'N': syncFiles(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, mediaList, playingVideoSrc, isSyncing, syncFiles]);

  if (playingVideoSrc) return <VideoPlayer src={playingVideoSrc} onClose={() => setPlayingVideoSrc(null)} />;

  return (
    <div className="screen" style={{justifyContent: 'flex-start', paddingTop: '1.5rem'}}>
      <div className="media-list-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '0.6rem', color: 'var(--green)' }}>{rememberedHandle?.name || 'VIRTUAL DRIVE'}</h2>
          <span style={{ fontSize: '0.5rem', color: '#666' }}>[ 'N' FOR NEW SCAN ]</span>
        </div>
        <ul className="media-list">
          {mediaList.map((item, index) => (
            <li key={item.id} className={`media-item ${index === selectedIndex ? 'selected' : ''}`}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>{item.title}</span>
              <span className="media-meta">[{item.format}]</span>
            </li>
          ))}
        </ul>
      </div>
      {isSyncing && <div style={{fontSize: '0.5rem', color: 'var(--blue)', marginTop: '0.5rem'}}>SYNCING...</div>}
    </div>
  );
};

export default MediaLibraryScreen;
