import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { SQLiteDatabase, openDatabaseAsync } from 'expo-sqlite/next';

import type { DictionaryEntry } from '@/types/dictionary';

const DATABASE_NAME = 'base.sqlite';

function resolvePaths() {
  const documentDirectory = FileSystem.documentDirectory;

  if (!documentDirectory) {
    throw new Error('Persistent storage is not available on this platform.');
  }

  const sqliteDirectory = `${documentDirectory}SQLite`;
  return {
    sqliteDirectory,
    databasePath: `${sqliteDirectory}/${DATABASE_NAME}`,
  };
}

async function ensureDirectoryExists(path: string) {
  const dirInfo = await FileSystem.getInfoAsync(path);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  }
}

async function copyDatabaseFromAssets(): Promise<void> {
  const { sqliteDirectory, databasePath } = resolvePaths();
  await ensureDirectoryExists(sqliteDirectory);

  const targetInfo = await FileSystem.getInfoAsync(databasePath);
  if (targetInfo.exists) {
    return;
  }

  const asset = Asset.fromModule(require('../assets/databases/base.sqlite'));
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error('Unable to resolve database asset.');
  }

  await FileSystem.copyAsync({
    from: asset.localUri,
    to: databasePath,
  });
}

export async function initializeDatabase(): Promise<SQLiteDatabase> {
  await copyDatabaseFromAssets();
  const db = await openDatabaseAsync(DATABASE_NAME);
  await validateDatabase(db);
  return db;
}

async function validateDatabase(db: SQLiteDatabase): Promise<void> {
  try {
    const expectedTables = ['entries', 'entries_fts'];
    const placeholders = expectedTables.map(() => '?').join(', ');
    const rows = await db.getAllAsync<{ name: string }>(
      `SELECT name FROM sqlite_master WHERE type='table' AND name IN (${placeholders})`,
      expectedTables
    );
    const found = new Set(rows.map((row) => row.name));
    const missing = expectedTables.filter((table) => !found.has(table));

    if (missing.length > 0) {
      throw new Error(
        `Dictionary database is missing expected tables: ${missing.join(', ')}. ` +
          'Regenerate the database with "npm run build:db -- --force".'
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to validate the dictionary database.');
  }
}

type RawEntry = {
  id: number;
  word: string;
  pos: string | null;
  sense: number;
  definition: string;
  examples: string | null;
};

function normalizeTerm(term: string): string {
  return term.normalize('NFKC').trim().toLowerCase();
}

function parseEntry(entry: RawEntry): DictionaryEntry {
  let examples: string[] = [];

  if (entry.examples) {
    try {
      const parsed = JSON.parse(entry.examples);
      if (Array.isArray(parsed)) {
        examples = parsed.filter((item) => typeof item === 'string').map((item) => item.trim());
      }
    } catch (error) {
      examples = [];
    }
  }

  return {
    id: entry.id,
    word: entry.word,
    pos: entry.pos,
    sense: entry.sense,
    definition: entry.definition,
    examples,
  };
}

export async function searchByPrefix(
  db: SQLiteDatabase,
  term: string,
  limit = 25
): Promise<DictionaryEntry[]> {
  const normalized = normalizeTerm(term);
  if (!normalized) {
    return [];
  }

  const results = await db.getAllAsync<RawEntry>(
    `SELECT id, word, pos, sense, definition, examples
     FROM entries
     WHERE LOWER(word) LIKE ?
     ORDER BY word, sense
     LIMIT ?`,
    [`${normalized}%`, limit]
  );

  return results.map(parseEntry);
}

export async function searchFullText(
  db: SQLiteDatabase,
  term: string,
  limit = 25
): Promise<DictionaryEntry[]> {
  const normalized = normalizeTerm(term).replace(/['"-]/g, ' ');
  if (!normalized) {
    return [];
  }

  const query = `${normalized}*`;

  const results = await db.getAllAsync<RawEntry>(
    `SELECT e.id, e.word, e.pos, e.sense, e.definition, e.examples
     FROM entries_fts f
     JOIN entries e ON e.id = f.rowid
     WHERE entries_fts MATCH ?
     ORDER BY bm25(entries_fts)
     LIMIT ?`,
    [query, limit]
  );

  return results.map(parseEntry);
}

export async function searchEntries(
  db: SQLiteDatabase,
  term: string,
  limit = 25
): Promise<DictionaryEntry[]> {
  const prefixMatches = await searchByPrefix(db, term, limit);
  const seen = new Set(prefixMatches.map((entry) => entry.id));

  if (prefixMatches.length >= limit) {
    return prefixMatches;
  }

  const remaining = limit - prefixMatches.length;
  const fullTextMatches = await searchFullText(db, term, remaining * 2);
  const merged = [...prefixMatches];

  for (const entry of fullTextMatches) {
    if (!seen.has(entry.id)) {
      merged.push(entry);
      seen.add(entry.id);
    }
    if (merged.length >= limit) {
      break;
    }
  }

  return merged;
}
