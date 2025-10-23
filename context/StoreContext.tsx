import React, { createContext, useContext, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { Language, StoreItem, Favorite, SearchHistory } from '@/types/dictionary';
import { AVAILABLE_LANGUAGES } from '@/data/languages';

interface AppSettings {
  darkMode: boolean;
  autoSave: boolean;
  pronunciationSpeed: 'slow' | 'normal' | 'fast';
}

interface StoreContextValue {
  languages: Language[];
  setLanguages: React.Dispatch<React.SetStateAction<Language[]>>;
  storeItems: StoreItem[];
  setStoreItems: React.Dispatch<React.SetStateAction<StoreItem[]>>;
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
  searchHistory: SearchHistory[];
  setSearchHistory: React.Dispatch<React.SetStateAction<SearchHistory[]>>;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  handlePurchase: (itemId: string) => void;
  handleDownloadLanguage: (languageCode: string) => void;
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (id: string) => void;
  addSearch: (search: SearchHistory) => void;
  clearHistory: () => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const INITIAL_ITEMS: StoreItem[] = [
  {
    id: '1',
    type: 'language',
    name: 'French Language Pack',
    description: 'Complete French dictionary with 50,000+ words and phrases',
    price: 2.99,
    languageCode: 'fr',
    isPurchased: false,
  },
  {
    id: '2',
    type: 'language',
    name: 'German Language Pack',
    description: 'Complete German dictionary with pronunciation guides',
    price: 2.99,
    languageCode: 'de',
    isPurchased: false,
  },
  {
    id: '3',
    type: 'language',
    name: 'Japanese Language Pack',
    description: 'Japanese dictionary with Kanji, Hiragana, and Katakana',
    price: 3.99,
    languageCode: 'ja',
    isPurchased: false,
  },
  {
    id: '4',
    type: 'feature',
    name: 'Offline Audio Pronunciation',
    description: 'Download audio files for offline pronunciation of all words',
    price: 4.99,
    isPurchased: false,
  },
  {
    id: '5',
    type: 'feature',
    name: 'Advanced Examples Pack',
    description: 'Get 10+ usage examples for every word translation',
    price: 1.99,
    isPurchased: false,
  },
];

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  autoSave: true,
  pronunciationSpeed: 'normal',
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [languages, setLanguages] = useState<Language[]>(AVAILABLE_LANGUAGES);
  const [storeItems, setStoreItems] = useState<StoreItem[]>(INITIAL_ITEMS);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handlePurchase = (itemId: string) => {
    setStoreItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, isPurchased: true } : i)));
    const purchased = storeItems.find((i) => i.id === itemId);
    if (purchased?.languageCode) {
      setLanguages((prev) =>
        prev.map((l) => (l.code === purchased.languageCode ? { ...l, isPremium: false } : l))
      );
    }
  };

  const handleDownloadLanguage = (languageCode: string) => {
    Alert.alert('Download Started', 'Language pack is being downloaded...');
    setTimeout(() => {
      setLanguages((prev) =>
        prev.map((lang) => (lang.code === languageCode ? { ...lang, isDownloaded: true } : lang))
      );
      Alert.alert('Download Complete', 'Language pack is now available offline!');
    }, 1500);
  };

  const addFavorite = (favorite: Favorite) => {
    setFavorites((prev) => [favorite, ...prev]);
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id));
  };

  const addSearch = (search: SearchHistory) => {
    // Only add to history if autoSave is enabled
    if (settings.autoSave) {
      setSearchHistory((prev) => [search, ...prev]);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const value = useMemo(
    () => ({ 
      languages, 
      setLanguages, 
      storeItems, 
      setStoreItems, 
      favorites,
      setFavorites,
      searchHistory,
      setSearchHistory,
      settings,
      updateSettings,
      handlePurchase, 
      handleDownloadLanguage,
      addFavorite,
      removeFavorite,
      addSearch,
      clearHistory
    }),
    [languages, storeItems, favorites, searchHistory, settings]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}