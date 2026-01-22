
import React, { useEffect, useRef } from 'react';
import { WikiArticle } from '../types.ts';

interface WikipediaPopupProps {
  article: WikiArticle;
  onClose: () => void;
}

const WikipediaPopup: React.FC<WikipediaPopupProps> = ({ article, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const contentElement = contentRef.current;
      
      switch (e.key) {
        case 'ArrowDown':
          if (contentElement) {
            e.preventDefault();
            contentElement.scrollTop += 80; // Faster scrolling for larger text
          }
          break;
        case 'ArrowUp':
          if (contentElement) {
            e.preventDefault();
            contentElement.scrollTop -= 80;
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    // Attach to window to capture Escape key from anywhere
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="wiki-popup-overlay">
      <div className="wiki-popup-content">
        <h2 className="wiki-title">{article.title}</h2>
        <div 
          ref={contentRef}
          className="wiki-body"
        >
          {/* Fixed: Display Gemini text using pre-wrap for authentic terminal feel instead of dangerouslySetInnerHTML */}
          <div style={{ whiteSpace: 'pre-wrap', marginBottom: '1.5rem', lineHeight: '1.4' }}>
            {article.content}
          </div>
          
          {/* Display grounding sources as required by Gemini API guidelines */}
          {article.sources && article.sources.length > 0 && (
            <div className="sources-panel" style={{ borderTop: '1px solid #333', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ fontSize: '0.5rem', color: 'var(--yellow)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                SUB-ETHER DATA SOURCES:
              </div>
              {article.sources.map((src, idx) => (
                <div key={idx} style={{ marginBottom: '0.3rem', fontSize: '0.45rem' }}>
                  <a 
                    href={src.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: 'var(--blue)', textDecoration: 'none' }}
                  >
                    &gt; {src.title || src.uri}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="wiki-footer-hint">
          [ ESC ] TO CLOSE ENTRY  |  [ ARROWS ] TO SCROLL DATA
        </div>
      </div>
    </div>
  );
};

export default WikipediaPopup;
