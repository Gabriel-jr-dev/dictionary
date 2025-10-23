import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchInput from '@/components/SearchInput';
import SearchResultCard from '@/components/SearchResultCard';
import { SQLiteDatabase } from 'expo-sqlite';

import { initializeDatabase, searchEntries } from '@/lib/database';
import type { DictionaryEntry } from '@/types/dictionary';

export default function SearchScreen() {
  const [initializing, setInitializing] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    let isMounted = true;

    initializeDatabase()
      .then((database) => {
        if (isMounted) {
          setDb(database);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError('Failed to load the dictionary database.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setInitializing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = useCallback(
    async (term: string) => {
      setQuery(term);

      if (!term.trim()) {
        setResults([]);
        setError(null);
        return;
      }

      setError(null);

      if (!db) {
        return;
      }

      setIsSearching(true);
      try {
        const entries = await searchEntries(db, term, 30);
        setResults(entries);
        setError(entries.length === 0 ? 'No results found.' : null);
      } catch (err) {
        console.error(err);
        setError('Something went wrong while searching.');
      } finally {
        setIsSearching(false);
      }
    },
    [db]
  );

  const isDatabaseReady = Boolean(db);

  const header = useMemo(
    () => (
      <View className="gap-6 px-6 pb-6">
        <View className="gap-2 pt-10">
          <Text className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">English Dictionary</Text>
          <Text className="text-3xl font-bold text-slate-900">Explore definitions and usage examples</Text>
          <Text className="text-base leading-6 text-slate-600">
            Search English terms offline using the preloaded WordNet database.
          </Text>
        </View>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearch}
          disabled={initializing || isSearching || !isDatabaseReady}
        />
        {initializing ? (
          <View className="flex-row items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
            <ActivityIndicator size="small" color="#2563eb" />
            <Text className="text-sm text-blue-700">Preparing the database…</Text>
          </View>
        ) : null}
        {error ? (
          <View className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
            <Text className="text-sm text-rose-700">{error}</Text>
          </View>
        ) : null}
      </View>
    ),
    [error, handleSearch, initializing, isDatabaseReady, isSearching, query]
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View className="h-4" />}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View className="px-6">
            <SearchResultCard entry={item} />
          </View>
        )}
        ListEmptyComponent={
          isDatabaseReady && query.trim().length > 0 && !isSearching && !error ? (
            <View className="px-6">
              <View className="rounded-2xl border border-slate-200 bg-white p-6">
                <Text className="text-base leading-6 text-slate-600">
                  We could not find any matches. Try adjusting your query or searching for a different term.
                </Text>
              </View>
            </View>
          ) : null
        }
        refreshing={isSearching}
        onRefresh={() => handleSearch(query)}
      />
    </SafeAreaView>
  );
}
