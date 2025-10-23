export interface DictionaryEntry {
  id: number;
  word: string;
  pos: string | null;
  sense: number;
  definition: string;
  examples: string[];
}
