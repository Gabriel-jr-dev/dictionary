import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams } from 'expo-router';

import { getWordDetailsByEntryId, initializeDatabase } from '@/lib/database';
import type { DictionarySense, DictionaryWordDetails } from '@/types/dictionary';

export default function EntryScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const [entry, setEntry] = useState<DictionaryWordDetails | null>(null);
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

  useEffect(() => {
    let isMounted = true;

    async function loadEntry() {
      if (!Number.isFinite(entryId)) {
        if (isMounted) {
          setError('Unable to determine which entry to display.');
          setEntry(null);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setLoading(true);
        setError(null);
        setEntry(null);
      }

      try {
        const db = await initializeDatabase();
        const result = await getWordDetailsByEntryId(db, entryId);

        if (!isMounted) {
          return;
        }

        if (!result) {
          setError('We could not find the requested entry.');
          setEntry(null);
        } else {
          setEntry(result);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Failed to load the dictionary entry.');
          setEntry(null);
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
          title: entry ? entry.word : loading ? 'Loading…' : 'Entry',
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
      ) : entry ? (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}>
          <View className="space-y-8">
            <View className="gap-3">
              <Text className="text-4xl font-bold text-slate-900">{entry.word}</Text>
              <PartsOfSpeechList senses={entry.senses} />
              <Text className="text-sm text-slate-500">
                Showing {entry.senses.length} definition{entry.senses.length === 1 ? '' : 's'} for this word.
              </Text>
            </View>

            {entry.senses.length > 0 ? (
              <View className="space-y-4">
                {entry.senses.map((sense) => (
                  <SenseCard key={sense.id} sense={sense} />
                ))}
              </View>
            ) : (
              <View className="rounded-3xl border border-amber-100 bg-amber-50 p-6">
                <Text className="text-base leading-7 text-amber-800">
                  Definitions for this word are not available in the offline database.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

function PartsOfSpeechList({ senses }: { senses: DictionarySense[] }) {
  const uniqueParts = Array.from(
    new Set(
      senses
        .map((sense) => sense.pos?.trim())
        .filter((pos): pos is string => typeof pos === 'string' && pos.length > 0)
    )
  );

  if (uniqueParts.length === 0) {
    return null;
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {uniqueParts.map((pos) => (
        <View key={pos} className="rounded-full bg-blue-100 px-3 py-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-blue-700">{pos.toUpperCase()}</Text>
        </View>
      ))}
    </View>
  );
}

function SenseCard({ sense }: { sense: DictionarySense }) {
  const heading = sense.pos ? sense.pos.toUpperCase() : 'Definition';

  return (
    <View className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <View className="flex-row items-baseline justify-between">
        <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {heading}
        </Text>
        <Text className="text-xs font-medium text-slate-400">Sense {sense.sense}</Text>
      </View>
      <Text className="mt-3 text-base leading-7 text-slate-700">{sense.definition}</Text>
      {sense.examples.length > 0 ? (
        <View className="mt-4 space-y-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">Examples</Text>
          {sense.examples.map((example, index) => (
            <Text key={index} className="text-sm leading-6 text-slate-600">
              • {example}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
