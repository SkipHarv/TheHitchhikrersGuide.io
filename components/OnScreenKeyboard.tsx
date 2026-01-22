
import React from 'react';

interface OnScreenKeyboardProps {
  layout: string[][];
  focusedKey: { row: number; col: number };
  onKeyClick?: (key: string) => void;
}

const OnScreenKeyboard: React.FC<OnScreenKeyboardProps> = ({ layout, focusedKey, onKeyClick }) => {
  return (
    <div className="keyboard">
      {layout.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key, colIndex) => {
            const isFocused = rowIndex === focusedKey.row && colIndex === focusedKey.col;
            const isSpecialKey = key.length > 1;

            let keyClasses = 'keyboard-key';
            if (isFocused) keyClasses += ' focused';
            if (isSpecialKey) keyClasses += ' special';
            if (key === 'SPACE') keyClasses += ' space';
            
            const handleKeyInteraction = (e: React.MouseEvent) => {
              if (onKeyClick) onKeyClick(key);
            };

            if (key === 'SPACE') {
              return (
                <div 
                  key={key} 
                  className={keyClasses}
                  onClick={handleKeyInteraction}
                  style={{ cursor: 'pointer' }}
                >
                  <span>SPACE</span>
                  <span className="space-label">(is big)</span>
                </div>
              );
            }

            return (
              <div 
                key={key} 
                className={keyClasses}
                onClick={handleKeyInteraction}
                style={{ cursor: 'pointer' }}
              >
                {key}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default OnScreenKeyboard;
