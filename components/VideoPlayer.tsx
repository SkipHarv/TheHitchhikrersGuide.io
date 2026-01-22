import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  src: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBooting, setIsBooting] = useState(true);
  const fileName = src.split('/').pop() || 'media.mp4';

  useEffect(() => {
    const videoElement = videoRef.current;
    const containerElement = containerRef.current;

    // Fast boot for low-power devices
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 400);

    if (containerElement && document.fullscreenEnabled) {
      containerElement.requestFullscreen().catch(() => {});
    }

    if (videoElement) {
      const handleCanPlay = () => {
        if (!isBooting) {
          videoElement.play().catch(e => console.error("Playback failed", e));
        }
      };

      const handleEnded = () => {
        onClose();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.key === 'q' || e.key === 'Backspace') {
          e.preventDefault();
          onClose();
        }
      };

      videoElement.addEventListener('canplay', handleCanPlay);
      videoElement.addEventListener('ended', handleEnded);
      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        videoElement.removeEventListener('canplay', handleCanPlay);
        videoElement.removeEventListener('ended', handleEnded);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [src, onClose, isBooting]);

  return (
    <div ref={containerRef} className="video-player-container" style={{ cursor: 'none' }}>
      {isBooting ? (
        <div className="terminal-output">
          <div style={{color: 'var(--blue)'}}>HHGTTG-PLAYER v4.2</div>
          <div>VO: DRM 480x320@16bpp</div>
          <div>HW: V3D ACCEL ENABLED</div>
          <div>CODEC: H.264/AVC [HW]</div>
          <div>PLAY: {fileName}</div>
          <div className="cursor-blink">_</div>
        </div>
      ) : (
        <video 
          ref={videoRef} 
          src={src} 
          width="480"
          height="320"
          autoPlay 
          controls={false}
          playsInline
          preload="auto"
          disablePictureInPicture
          style={{ objectFit: 'contain' }}
        />
      )}
    </div>
  );
};

export default VideoPlayer;