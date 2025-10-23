import { memo } from 'react';
import { Text, View } from 'react-native';
import type { DictionaryEntry } from '@/types/dictionary';

interface SearchResultCardProps {
  entry: DictionaryEntry;
}

function SearchResultCard({ entry }: SearchResultCardProps) {
  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-baseline gap-3">
        <Text className="text-2xl font-semibold text-slate-900">{entry.word}</Text>
        {entry.pos ? <Text className="text-sm uppercase tracking-wide text-slate-500">{entry.pos}</Text> : null}
        <Text className="text-xs font-medium text-slate-400">Sense {entry.sense}</Text>
      </View>
      <Text className="text-base leading-6 text-slate-700">{entry.definition}</Text>
      {entry.examples.length > 0 ? (
        <View className="mt-3 space-y-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">Examples</Text>
          {entry.examples.map((example, index) => (
            <Text key={index} className="text-sm leading-5 text-slate-600">
              • {example}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default memo(SearchResultCard);
