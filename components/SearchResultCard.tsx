import { memo, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { DictionaryEntry } from '@/types/dictionary';

interface SearchResultCardProps {
  entry: DictionaryEntry;
}

const COLLAPSED_EXAMPLES_LIMIT = 3;

function SearchResultCard({ entry }: SearchResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreExamples = entry.examples.length > COLLAPSED_EXAMPLES_LIMIT;

  const displayedExamples = useMemo(() => {
    if (isExpanded || !hasMoreExamples) {
      return entry.examples;
    }
    return entry.examples.slice(0, COLLAPSED_EXAMPLES_LIMIT);
  }, [entry.examples, hasMoreExamples, isExpanded]);

  const toggleLabel = isExpanded ? 'Show less' : 'Show more';

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
          {displayedExamples.map((example, index) => (
            <Text key={index} className="text-sm leading-5 text-slate-600">
              • {example}
            </Text>
          ))}
          {hasMoreExamples ? (
            <Pressable onPress={() => setIsExpanded((current) => !current)}>
              <Text className="text-sm font-semibold text-indigo-600">{toggleLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default memo(SearchResultCard);
