import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

import { getEntriesByWord, getEntryById, initializeDatabase } from '@/lib/database';
import type { DictionaryEntry } from '@/types/dictionary';

export default function EntryScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const entryId = useMemo(() => {
    const value = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!value) {
      return NaN;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : NaN;
  }, [params.id]);

  const primaryEntry = entries.length > 0 ? entries[0] : null;
  const partsOfSpeech = useMemo(() => {
    if (entries.length === 0) {
      return [] as string[];
    }

    return Array.from(
      new Set(
        entries
          .map((item) => item.pos)
          .filter((pos): pos is string => typeof pos === 'string' && pos.length > 0)
      )
    );
  }, [entries]);

  useEffect(() => {
    let isMounted = true;

    async function loadEntry() {
      if (!Number.isFinite(entryId)) {
        if (isMounted) {
          setError('Unable to determine which entry to display.');
          setEntries([]);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
        setEntries([]);
      }

      try {
        const db = await initializeDatabase();
        const result = await getEntryById(db, entryId);

        if (!isMounted) {
          return;
        }

        if (!result) {
          setError('We could not find the requested entry.');
          setEntries([]);
        } else {
          const relatedEntries = await getEntriesByWord(db, result.word);

          if (!isMounted) {
            return;
          }

          const combinedEntries = [...relatedEntries, result];
          const dedupedEntries: DictionaryEntry[] = [];
          const seenIds = new Set<number>();

          for (const item of combinedEntries) {
            if (!seenIds.has(item.id)) {
              dedupedEntries.push(item);
              seenIds.add(item.id);
            }
          }

          dedupedEntries.sort((a, b) => {
            if (a.sense !== b.sense) {
              return a.sense - b.sense;
            }
            return a.id - b.id;
          });

          setEntries(dedupedEntries);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Failed to load the dictionary entry.');
          setEntries([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEntry();

    return () => {
      isMounted = false;
    };
  }, [entryId]);

  return (
    <SafeAreaView className="flex-1 bg-slate-100">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: '#0f172a',
          headerStyle: { backgroundColor: '#e2e8f0' },
          title: primaryEntry ? primaryEntry.word : loading ? 'Loading…' : 'Entry',
        }}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator size="small" color="#2563eb" />
          <Text className="text-sm text-slate-600">Loading entry…</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center px-6">
          <View className="rounded-3xl border border-rose-100 bg-rose-50/90 p-6 shadow-md shadow-rose-200/60">
            <Text className="text-base leading-6 text-rose-700">{error}</Text>
          </View>
        </View>
      ) : primaryEntry ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <View className="gap-8">
            <View className="overflow-hidden rounded-[32px] bg-slate-900 p-8 shadow-2xl shadow-slate-900/40">
              <Text className="text-4xl font-bold text-white">{primaryEntry.word}</Text>
              {partsOfSpeech.length > 0 ? (
                <View className="mt-4 flex-row flex-wrap gap-2">
                  {partsOfSpeech.map((pos) => (
                    <View key={pos} className="rounded-full bg-white/10 px-4 py-1.5">
                      <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">{pos}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
              <Text className="mt-6 text-base leading-7 text-white/80">
                Detailed senses and curated usage examples help you understand how this word adapts across
                contexts.
              </Text>
            </View>

            <View className="gap-5">
              {entries.map((item) => (
                <View
                  key={item.id}
                  className="gap-4 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-lg shadow-slate-200/70"
                >
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="gap-2">
                      {item.pos ? (
                        <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">{item.pos}</Text>
                      ) : null}
                      <Text className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
                        Sense {item.sense}
                      </Text>
                    </View>
                    <View className="rounded-2xl bg-blue-50 px-3 py-1">
                      <Text className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-700">Definition</Text>
                    </View>
                  </View>
                  <Text className="text-base leading-7 text-slate-700">{item.definition}</Text>
                  {item.examples.length > 0 ? (
                    <View className="gap-2 rounded-2xl bg-slate-50/80 p-4">
                      <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                        Usage examples
                      </Text>
                      {item.examples.map((example, index) => (
                        <Text key={index} className="text-base leading-6 text-slate-700">
                          • {example}
                        </Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
