import { Language, Translation } from '@/types/dictionary';

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isPremium: false, isDownloaded: true, downloadSize: '15 MB' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', isPremium: false, isDownloaded: true, downloadSize: '18 MB' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isPremium: false, isDownloaded: true, downloadSize: '16 MB' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isPremium: true, isDownloaded: false, downloadSize: '17 MB' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isPremium: true, isDownloaded: false, downloadSize: '19 MB' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isPremium: true, isDownloaded: false, downloadSize: '16 MB' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isPremium: true, isDownloaded: false, downloadSize: '25 MB' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isPremium: true, isDownloaded: false, downloadSize: '28 MB' },
];

// Mock dictionary data for offline use
const MOCK_DICTIONARY: Record<string, Record<string, Translation>> = {
  'en-pt': {
    'hello': {
      word: 'hello',
      translation: 'olá',
      pronunciation: 'oh-LAH',
      partOfSpeech: 'interjection',
      examples: ['Hello, how are you?', 'Olá, como você está?']
    },
    'world': {
      word: 'world',
      translation: 'mundo',
      pronunciation: 'MOON-doo',
      partOfSpeech: 'noun',
      examples: ['The world is beautiful', 'O mundo é bonito']
    },
    'book': {
      word: 'book',
      translation: 'livro',
      pronunciation: 'LEE-vroo',
      partOfSpeech: 'noun',
      examples: ['I love reading books', 'Eu amo ler livros']
    },
  },
  'pt-en': {
    'olá': {
      word: 'olá',
      translation: 'hello',
      pronunciation: 'heh-LOH',
      partOfSpeech: 'interjection',
      examples: ['Olá, como você está?', 'Hello, how are you?']
    },
    'mundo': {
      word: 'mundo',
      translation: 'world',
      pronunciation: 'WURLD',
      partOfSpeech: 'noun',
      examples: ['O mundo é bonito', 'The world is beautiful']
    },
  },
  'en-es': {
    'hello': {
      word: 'hello',
      translation: 'hola',
      pronunciation: 'OH-lah',
      partOfSpeech: 'interjection',
      examples: ['Hello, how are you?', 'Hola, ¿cómo estás?']
    },
    'book': {
      word: 'book',
      translation: 'libro',
      pronunciation: 'LEE-broh',
      partOfSpeech: 'noun',
      examples: ['I love reading books', 'Me encanta leer libros']
    },
  },
};

export const searchTranslation = (
  word: string,
  sourceLanguage: string,
  targetLanguage: string
): Translation | null => {
  const key = `${sourceLanguage}-${targetLanguage}`;
  const dictionary = MOCK_DICTIONARY[key];
  
  if (!dictionary) return null;
  
  const normalizedWord = word.toLowerCase().trim();
  return dictionary[normalizedWord] || null;
};

export const getLanguageByCode = (code: string): Language | undefined => {
  return AVAILABLE_LANGUAGES.find(lang => lang.code === code);
};
