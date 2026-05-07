/** Translation service using Sarvam.ai API with localStorage caching */

const API_BASE = 'https://api.sarvam.ai';
const API_KEY = import.meta.env.VITE_SARVAM_API_KEY || '';
const CACHE_KEY_PREFIX = 'memora_translation_cache';

if (!API_KEY) {
  console.warn('[Memora] VITE_SARVAM_API_KEY is not set. Translation API calls will fail.');
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-IN', name: 'English', nativeName: 'English', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'ur-IN', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
  { code: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'od-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

function getCacheKey(targetLang: string): string {
  return `${CACHE_KEY_PREFIX}_${targetLang}`;
}

function getCache(targetLang: string): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(getCacheKey(targetLang));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setCache(targetLang: string, cache: Record<string, string>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getCacheKey(targetLang), JSON.stringify(cache));
  } catch {
    // localStorage might be full
  }
}

export function getCachedTranslation(text: string, targetLang: string): string | null {
  if (targetLang === 'en-IN') return text;
  const cache = getCache(targetLang);
  return cache[text] || null;
}

export async function translateText(
  text: string,
  targetLang: string,
  sourceLang: string = 'en-IN'
): Promise<string> {
  if (!text || !text.trim()) return text;
  if (targetLang === 'en-IN' || targetLang === sourceLang) return text;

  // Check cache first
  const cached = getCachedTranslation(text, targetLang);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_BASE}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': API_KEY,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: sourceLang,
        target_language_code: targetLang,
        model: 'sarvam-translate:v1',
        mode: 'formal',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Sarvam translation error:', response.status, errorText);
      return text; // fallback to original
    }

    const data = await response.json();
    const translated = data.translated_text || text;

    // Store in cache
    const cache = getCache(targetLang);
    cache[text] = translated;
    setCache(targetLang, cache);

    return translated;
  } catch (err) {
    console.error('Translation request failed:', err);
    return text; // fallback to original
  }
}

/** Batch translate multiple texts at once */
export async function translateBatch(
  texts: string[],
  targetLang: string,
  sourceLang: string = 'en-IN'
): Promise<Record<string, string>> {
  if (targetLang === 'en-IN') {
    return Object.fromEntries(texts.map((t) => [t, t]));
  }

  const result: Record<string, string> = {};
  const toTranslate: string[] = [];
  const cache = getCache(targetLang);

  for (const text of texts) {
    if (cache[text]) {
      result[text] = cache[text];
    } else {
      toTranslate.push(text);
      result[text] = text; // default fallback
    }
  }

  // Translate uncached texts sequentially to avoid rate limits
  for (const text of toTranslate) {
    const translated = await translateText(text, targetLang, sourceLang);
    result[text] = translated;
  }

  return result;
}

/** Clear translation cache for a language or all languages */
export function clearTranslationCache(targetLang?: string) {
  if (typeof window === 'undefined') return;
  if (targetLang) {
    localStorage.removeItem(getCacheKey(targetLang));
  } else {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}
