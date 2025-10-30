import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import SearchInput from '@/components/SearchInput';
import { SQLiteDatabase } from 'expo-sqlite/next';

import SearchResultCard from '@/components/SearchResultCard';
import { initializeDatabase, searchEntries } from '@/lib/database';
import type { DictionaryEntry, DictionaryWordDetails } from '@/types/dictionary';

export default function SearchScreen() {
  const [initializing, setInitializing] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const latestRequestId = useRef(0);

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
      const requestId = ++latestRequestId.current;
      setQuery(term);

      const trimmedTerm = term.trim();

      if (!trimmedTerm) {
        setResults([]);
        setError(null);
        setIsSearching(false);
        return;
      }

      setError(null);

      if (!db) {
        return;
      }

      setIsSearching(true);
      try {
        const entries = await searchEntries(db, trimmedTerm, 30);
        if (latestRequestId.current !== requestId) {
          return;
        }
        setResults(entries);
        setError(entries.length === 0 ? 'No results found.' : null);
      } catch (err) {
        if (latestRequestId.current !== requestId) {
          return;
        }
        console.error(err);
        setError('Something went wrong while searching.');
      } finally {
        if (latestRequestId.current === requestId) {
          setIsSearching(false);
        }
      }
    },
    [db]
  );

  const isDatabaseReady = Boolean(db);

  const header = useMemo(
    () => (
      <View className="gap-6 px-6 pb-10">
        <View className="pt-10">
          <View className="overflow-hidden rounded-[32px] bg-slate-900 p-7 shadow-2xl shadow-slate-900/40">
            <View className="flex-row flex-wrap items-center justify-between gap-3">
              <View className="rounded-full bg-white/10 px-3 py-1">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                  English Dictionary
                </Text>
              </View>
              <View className="rounded-full bg-white/10 px-3 py-1">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                  Offline Ready
                </Text>
              </View>
            </View>
            <Text className="mt-6 text-[32px] font-bold leading-tight text-white">
              Explore nuanced meanings with a modern offline lexicon
            </Text>
            <Text className="mt-3 text-base leading-6 text-white/80">
              Instantly search more than two hundred thousand definitions, curated from the WordNet 3.1 dataset,
              complete with examples and parts of speech.
            </Text>
            <View className="mt-6 flex-row flex-wrap gap-3">
              <View className="min-w-[120px] flex-1 rounded-2xl bg-white/10 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Entries</Text>
                <Text className="mt-2 text-2xl font-semibold text-white">200k+</Text>
              </View>
              <View className="min-w-[120px] flex-1 rounded-2xl bg-white/10 p-4">
                <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Examples</Text>
                <Text className="mt-2 text-2xl font-semibold text-white">140k+</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="-mt-8 gap-3">
          <SearchInput
            value={query}
            onChangeText={handleSearch}
            onSubmit={handleSearch}
            disabled={initializing || !isDatabaseReady}
          />
          {initializing ? (
            <View className="flex-row items-center gap-3 rounded-3xl border border-blue-100 bg-blue-50/90 px-4 py-3">
              <ActivityIndicator size="small" color="#2563eb" />
              <Text className="text-sm text-blue-700">Preparing the WordNet database…</Text>
            </View>
          ) : null}
          {error ? (
            <View className="rounded-3xl border border-rose-100 bg-rose-50/90 px-4 py-3">
              <Text className="text-sm text-rose-700">{error}</Text>
            </View>
          ) : null}
        </View>
      </View>
    ),
    [error, handleSearch, initializing, isDatabaseReady, query]
  );

  const groupedResults = useMemo<DictionaryWordDetails[]>(() => {
    if (results.length === 0) {
      return [];
    }

    const groups: DictionaryWordDetails[] = [];
    const lookup = new Map<string, DictionaryWordDetails>();

    for (const entry of results) {
      let group = lookup.get(entry.word);

      if (!group) {
        group = { word: entry.word, senses: [] };
        lookup.set(entry.word, group);
        groups.push(group);
      }

      group.senses.push({
        id: entry.id,
        pos: entry.pos,
        sense: entry.sense,
        definition: entry.definition,
        examples: entry.examples,
      });
    }

    return groups.map((group) => ({
      word: group.word,
      senses: [...group.senses].sort((a, b) => {
        if (a.sense !== b.sense) {
          return a.sense - b.sense;
        }
        return a.id - b.id;
      }),
    }));
  }, [results]);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <FlatList
        data={groupedResults}
        keyExtractor={(item) => `${item.word}-${item.senses[0]?.id ?? '0'}`}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={header}
        ItemSeparatorComponent={() => <View className="h-4" />}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View className="px-6">
            <SearchResultCard
              word={item.word}
              senses={item.senses}
              onSelectSense={(senseId) =>
                router.push({
                  pathname: '/entry/[id]',
                  params: { id: senseId.toString() },
                })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          isDatabaseReady && query.trim().length > 0 && !isSearching && !error ? (
            <View className="px-6">
              <View className="items-start gap-4 rounded-3xl border border-slate-200 border-dashed bg-white/95 p-6">
                <Text className="text-lg font-semibold text-slate-900">No matches yet</Text>
                <Text className="text-base leading-6 text-slate-600">
                  Try another spelling, search for a synonym, or broaden your term to explore related entries.
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
