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
    <SafeAreaView className="flex-1 bg-slate-50">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTintColor: '#1e293b',
          headerStyle: { backgroundColor: '#f8fafc' },
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
          <View className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
            <Text className="text-base leading-6 text-rose-700">{error}</Text>
          </View>
        </View>
      ) : primaryEntry ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <View className="space-y-6">
            <View className="gap-2">
              <Text className="text-4xl font-bold text-slate-900">{primaryEntry.word}</Text>
              {partsOfSpeech.length > 0 ? (
                <Text className="text-sm uppercase tracking-wide text-slate-500">
                  {partsOfSpeech.join(' • ')}
                </Text>
              ) : null}
            </View>

            <View className="space-y-4">
              {entries.map((item) => (
                <View key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <View className="flex-row items-baseline justify-between gap-3">
                    {item.pos ? (
                      <Text className="text-sm uppercase tracking-wide text-slate-500">{item.pos}</Text>
                    ) : null}
                    <Text className="text-xs font-medium text-slate-400">Sense {item.sense}</Text>
                  </View>
                  <Text className="mt-3 text-base leading-7 text-slate-700">{item.definition}</Text>
                  {item.examples.length > 0 ? (
                    <View className="mt-4 space-y-2">
                      <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">Examples</Text>
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
