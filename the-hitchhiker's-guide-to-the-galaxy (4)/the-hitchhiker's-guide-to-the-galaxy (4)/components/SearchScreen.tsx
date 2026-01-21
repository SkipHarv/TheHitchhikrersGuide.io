import React, { useState, useEffect, useCallback } from 'react';
import OnScreenKeyboard from './OnScreenKeyboard.tsx';
import WikipediaPopup from './WikipediaPopup.tsx';
import { WikiArticle } from '../types.ts';

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

  // Use Wikipedia REST API to perform search + summary retrieval (no API key)
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setArticle(null);
    try {
      // 1) Search for matching page titles (REST search)
      const searchRes = await fetch(
        `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(query)}&limit=5`
      );
      if (!searchRes.ok) throw new Error('Search request failed');
      const searchJson: any = await searchRes.json();

      if (!searchJson.pages || searchJson.pages.length === 0) {
        setError('No results found.');
        return;
      }

      // 2) Choose best match (top result) and fetch its summary
      const top = searchJson.pages[0];
      const pageKey = top.key;
      const summaryRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageKey)}`
      );
      if (!summaryRes.ok) throw new Error('Failed to fetch page summary');
      const summaryJson: any = await summaryRes.json();

      const content = summaryJson.extract || top.excerpt || 'No summary available.';
      const sourceUri =
        (summaryJson.content_urls && summaryJson.content_urls.desktop && summaryJson.content_urls.desktop.page) ||
        `https://en.wikipedia.org/wiki/${encodeURIComponent(pageKey)}`;

      setArticle({
        title: summaryJson.title || pageKey,
        content,
        sources: [{ title: summaryJson.title || pageKey, uri: sourceUri }],
      });
    } catch (e: any) {
      setError(e?.message || 'Search failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === 'SPACE') setQuery(prev => prev + ' ');
      else if (key === 'BACKSPACE') setQuery(prev => prev.slice(0, -1));
      else if (key === 'SEARCH') handleSearch();
      else setQuery(prev => prev + key);
    },
    [handleSearch]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (article || isLoading || ['1', '2', '3', '4', '5'].includes(e.key)) return;
      if (e.key.length === 1 && /^[a-zA-Z0-9 ]$/.test(e.key)) {
        setQuery(prev => prev + e.key.toUpperCase());
        return;
      }
      switch (e.key) {
        case 'Backspace':
          setQuery(prev => prev.slice(0, -1));
          break;
        case 'ArrowUp':
          setFocusedKey(prev => ({ ...prev, row: (prev.row - 1 + keyboardLayout.length) % keyboardLayout.length }));
          break;
        case 'ArrowDown':
          setFocusedKey(prev => ({ ...prev, row: (prev.row + 1) % keyboardLayout.length }));
          break;
        case 'ArrowLeft':
          setFocusedKey(prev => ({ ...prev, col: (prev.col - 1 + keyboardLayout[prev.row].length) % keyboardLayout[prev.row].length }));
          break;
        case 'ArrowRight':
          setFocusedKey(prev => ({ ...prev, col: (prev.col + 1) % keyboardLayout[prev.row].length }));
          break;
        case 'Enter':
          handleKeyPress(keyboardLayout[focusedKey.row][focusedKey.col]);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedKey, keyboardLayout, handleKeyPress, article, isLoading]);

  return (
    <div className="screen search-screen">
      <div className="search-input"><span>{query}</span><span className="block-cursor cursor-blink"></span></div>
      <OnScreenKeyboard layout={keyboardLayout} focusedKey={focusedKey} onKeyClick={handleKeyPress} />
      {isLoading && <div style={{color: 'var(--blue)', marginTop: '0.5rem', fontSize: '0.6rem'}}>Querying Wikipedia...</div>}
      {error && <div style={{color: 'var(--red)', marginTop: '0.5rem', fontSize: '0.6rem'}}>Error: {error}</div>}
      {article && <WikipediaPopup article={article} onClose={() => setArticle(null)} />}
    </div>
  );
};

export default SearchScreen;
