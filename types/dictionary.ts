export interface DictionaryEntry {
  id: number;
  word: string;
  pos: string | null;
  sense: number;
  definition: string;
  examples: string[];
}

export interface DictionarySense {
  id: number;
  pos: string | null;
  sense: number;
  definition: string;
  examples: string[];
}

export interface DictionaryWordDetails {
  word: string;
  senses: DictionarySense[];
}
