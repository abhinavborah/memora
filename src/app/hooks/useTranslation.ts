import { useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { translateText, translateBatch, getCachedTranslation } from '../services/translation';

interface UseTranslationResult {
  t: (text: string) => string;
  isTranslating: boolean;
  selectedLanguage: string;
  preload: (texts: string[]) => void;
}

/** React hook for translating UI text using Sarvam.ai with localStorage caching */
export function useTranslation(): UseTranslationResult {
  const { selectedLanguage } = useApp();
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingRef = useRef<Set<string>>(new Set());
  const langRef = useRef(selectedLanguage);

  // Reset cache when language changes
  useEffect(() => {
    if (langRef.current !== selectedLanguage) {
      langRef.current = selectedLanguage;
      setCache({});
      pendingRef.current = new Set();
    }
  }, [selectedLanguage]);

  const t = useCallback(
    (text: string): string => {
      if (!text || !text.trim()) return text;
      if (selectedLanguage === 'en-IN') return text;

      // Return from React state cache if available
      if (cache[text]) return cache[text];

      // Return from localStorage cache if available (sync)
      const lsCached = getCachedTranslation(text, selectedLanguage);
      if (lsCached) {
        setCache(prev => ({ ...prev, [text]: lsCached }));
        return lsCached;
      }

      // Queue for async translation if not already pending
      if (!pendingRef.current.has(text)) {
        pendingRef.current.add(text);
        setIsTranslating(true);

        translateText(text, selectedLanguage)
          .then(translated => {
            setCache(prev => ({ ...prev, [text]: translated }));
          })
          .catch(() => {
            // Silently fall back to original text
          })
          .finally(() => {
            pendingRef.current.delete(text);
            if (pendingRef.current.size === 0) {
              setIsTranslating(false);
            }
          });
      }

      return text; // Return original while translating
    },
    [cache, selectedLanguage]
  );

  const preload = useCallback((texts: string[]) => {
    if (selectedLanguage === 'en-IN') return;
    if (!texts.length) return;

    translateBatch(texts, selectedLanguage).catch(() => {
      // Silently ignore failures — UI will fall back to English
    });
  }, [selectedLanguage]);

  return { t, isTranslating, selectedLanguage, preload };
}
