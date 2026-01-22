
import React, { useState, useEffect, useCallback } from 'react';
import OnScreenKeyboard from './OnScreenKeyboard.tsx';
import WikipediaPopup from './WikipediaPopup.tsx';
import { WikiArticle } from '../types.ts';
import { GoogleGenAI } from "@google/genai";

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState(() => localStorage.getItem('hhgttg_query') || '');
  const [focusedKey, setFocusedKey] = useState({ row: 0, col: 0 });
  const [article, setArticle] = useState<WikiArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    ['BACKSPACE', 'SPACE', 'SEARCH'],
  ];

  useEffect(() => {
    localStorage.setItem('hhgttg_query', query);
  }, [query]);

  // Use Gemini API with Google Search grounding for authentic "The Guide" content
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `You are the Hitchhiker's Guide to the Galaxy. Provide an authoritative, witty, and slightly cynical guide entry for: ${query}. Use search grounding to ensure you have the latest facts about Earth and the surrounding galaxy.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "NO DATA RETURNED FROM SUB-ETHER ARRAY.";
      
      // Extract grounding sources as required by Gemini API guidelines
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => ({
          title: chunk.web?.title,
          uri: chunk.web?.uri
        }));

      setArticle({ 
        title: query.toUpperCase(), 
        content: text,
        sources: sources 
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'SUB-ETHER LINK FAILURE. PLEASE CONSULT A TOWEL.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'SPACE') setQuery(prev => prev + ' ');
    else if (key === 'BACKSPACE') setQuery(prev => prev.slice(0, -1));
    else if (key === 'SEARCH') handleSearch();
    else setQuery(prev => prev + key);
  }, [handleSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (article || isLoading || ['1', '2', '3', '4', '5'].includes(e.key)) return;
      if (e.key.length === 1 && /^[a-zA-Z0-9 ]$/.test(e.key)) {
        setQuery(prev => (prev + e.key.toUpperCase()));
        return;
      }
      switch (e.key) {
        case 'Backspace': setQuery(prev => prev.slice(0, -1)); break;
        case 'ArrowUp': setFocusedKey(prev => ({ ...prev, row: (prev.row - 1 + keyboardLayout.length) % keyboardLayout.length })); break;
        case 'ArrowDown': setFocusedKey(prev => ({ ...prev, row: (prev.row + 1) % keyboardLayout.length })); break;
        case 'ArrowLeft': setFocusedKey(prev => ({ ...prev, col: (prev.col - 1 + keyboardLayout[prev.row].length) % keyboardLayout[prev.row].length })); break;
        case 'ArrowRight': setFocusedKey(prev => ({ ...prev, col: (prev.col + 1) % keyboardLayout[prev.row].length })); break;
        case 'Enter': handleKeyPress(keyboardLayout[focusedKey.row][focusedKey.col]); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedKey, keyboardLayout, handleKeyPress, article, isLoading]);

  return (
    <div className="screen search-screen">
      <div className="search-input"><span>{query}</span><span className="block-cursor cursor-blink"></span></div>
      <OnScreenKeyboard layout={keyboardLayout} focusedKey={focusedKey} onKeyClick={handleKeyPress} />
      {isLoading && <div style={{color: 'var(--blue)', marginTop: '0.5rem', fontSize: '0.6rem'}}>Linking to Sub-Ether network...</div>}
      {error && <div style={{color: 'var(--red)', marginTop: '0.5rem', fontSize: '0.6rem'}}>Error: {error}</div>}
      {article && <WikipediaPopup article={article} onClose={() => setArticle(null)} />}
    </div>
  );
};

export default SearchScreen;
