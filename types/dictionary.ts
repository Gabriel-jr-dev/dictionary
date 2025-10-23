export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isPremium: boolean;
  isDownloaded: boolean;
  downloadSize: string;
}

export interface Translation {
  word: string;
  translation: string;
  pronunciation?: string;
  examples?: string[];
  partOfSpeech?: string;
}

export interface SearchHistory {
  id: string;
  word: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

export interface Favorite {
  id: string;
  word: string;
  translation: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

export interface StoreItem {
  id: string;
  type: 'language' | 'feature';
  name: string;
  description: string;
  price: number;
  languageCode?: string;
  isPurchased: boolean;
}
