/** React hook for Sarvam.ai translations with caching */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { translateText, getCachedTranslation } from '../services/translation';

export function useTranslation() {
  const { selectedLanguage } = useApp();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const pendingRef = useRef<Set<string>>(new Set());

  const t = useCallback(
    (text: string): string => {
      if (!text) return text;
      if (selectedLanguage === 'en-IN') return text;

      // Return from local state if available
      if (translations[text]) {
        return translations[text];
      }

      // Return from cache if available
      const cached = getCachedTranslation(text, selectedLanguage);
      if (cached) {
        // Schedule to update state so subsequent renders use it
        setTimeout(() => {
          setTranslations((prev) => ({ ...prev, [text]: cached }));
        }, 0);
        return cached;
      }

      // Trigger background translation if not already pending
      if (!pendingRef.current.has(text)) {
        pendingRef.current.add(text);
        translateText(text, selectedLanguage).then((translated) => {
          pendingRef.current.delete(text);
          setTranslations((prev) => ({ ...prev, [text]: translated }));
        });
      }

      return text; // return original while loading
    },
    [selectedLanguage, translations]
  );

  // Pre-translate a list of strings (useful for screens)
  const preload = useCallback(
    async (texts: string[]) => {
      if (selectedLanguage === 'en-IN') return;
      const uniqueTexts = [...new Set(texts.filter(Boolean))];
      for (const text of uniqueTexts) {
        if (translations[text] || pendingRef.current.has(text)) continue;
        pendingRef.current.add(text);
        const translated = await translateText(text, selectedLanguage);
        pendingRef.current.delete(text);
        setTranslations((prev) => ({ ...prev, [text]: translated }));
      }
    },
    [selectedLanguage, translations]
  );

  return { t, preload, selectedLanguage };
}
