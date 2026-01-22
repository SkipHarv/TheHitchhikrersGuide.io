import React, { useEffect, useState } from 'react';

const SystemScreen: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [lastPath, setLastPath] = useState<string>('Not set');
  const [intensity, setIntensity] = useState(() => 
    parseFloat(localStorage.getItem('hhgttg_crt_intensity') || '0.15')
  );
  const [speed, setSpeed] = useState(() => 
    parseFloat(localStorage.getItem('hhgttg_crt_speed') || '10')
  );

  useEffect(() => {
    // Attempt to read the persisted folder name from IndexedDB (GuideDB)
    const request = indexedDB.open('GuideDB', 1);
    request.onsuccess = () => {
      const db = request.result;
      if (db.objectStoreNames.contains('Settings')) {
        const tx = db.transaction('Settings', 'readonly');
        const req = tx.objectStore('Settings').get('last_dir_handle');
        req.onsuccess = () => {
          if (req.result) setLastPath(req.result.name);
        };
      }
    };

    const initialLogs = [
      "[  0.000000] Linux version 6.1.42-guide (hitchhiker@magrathea) (gcc 12.2.0) #1 SMP PREEMPT",
      "[  0.000001] Command line: chromium --kiosk --disable-infobars --app=https://the.guide",
      "[  0.420000] HHGTTG Media Driver v42 initialized",
      "[  0.500000] systemd[1]: Mounted /media/external_drive.",
      "[  1.000000] Network initialization successful. (10.42.0.42)",
      "--- PERSISTENT CONFIGURATION ---",
      `$ cat /etc/guide/media_path`,
      `LAST_SYNC_DIR: ${lastPath}`,
      "$ cat /etc/guide/version",
      "BUILD_ID: magrathea-7.4.2",
      "$ uptime",
      "up 42 days, 42 minutes, 42 users, load average: 0.00, 0.01, 0.05",
      "$ df -h /",
      "Filesystem      Size  Used Avail Use% Mounted on",
      "/dev/sda1       420G   42G  378G  10% /",
    ];
    setLogs(initialLogs);
  }, [lastPath]);

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setIntensity(val);
    document.documentElement.style.setProperty('--crt-intensity', val.toString());
    localStorage.setItem('hhgttg_crt_intensity', val.toString());
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSpeed(val);
    document.documentElement.style.setProperty('--crt-speed', `${val}s`);
    localStorage.setItem('hhgttg_crt_speed', val.toString());
  };

  return (
    <div className="screen" style={{ justifyContent: 'flex-start', paddingBottom: '1.5rem' }}>
      <div className="terminal-output" style={{ flex: 1, width: '100%' }}>
        {logs.map((log, i) => (
          <div key={i} className={log.startsWith('$') ? 'term-cmd' : ''}>
            {log}
          </div>
        ))}
        
        <div className="crt-calibration-panel">
          <div className="crt-calibration-title">CRT Beam Calibration</div>
          <div className="calibration-row">
            <div className="calibration-label">DEPTH:</div>
            <input 
              type="range" 
              className="calibration-slider" 
              min="0" 
              max="0.8" 
              step="0.01" 
              value={intensity}
              onChange={handleIntensityChange}
            />
            <div style={{ width: '30px', textAlign: 'right', fontSize: '0.45rem', color: 'var(--yellow)' }}>{Math.round(intensity * 100)}%</div>
          </div>
          <div className="calibration-row">
            <div className="calibration-label">FREQ:</div>
            <input 
              type="range" 
              className="calibration-slider" 
              min="1" 
              max="30" 
              step="0.5" 
              value={speed}
              onChange={handleSpeedChange}
            />
            <div style={{ width: '30px', textAlign: 'right', fontSize: '0.45rem', color: 'var(--yellow)' }}>{speed}s</div>
          </div>
        </div>

        <div className="term-cmd" style={{ marginTop: '0.5rem' }}>$ <span className="block-cursor cursor-blink"></span></div>
      </div>
    </div>
  );
};

export default SystemScreen;