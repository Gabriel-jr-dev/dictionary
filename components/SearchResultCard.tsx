import { memo, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import type { DictionarySense } from '@/types/dictionary';

interface SearchResultCardProps {
  word: string;
  senses: DictionarySense[];
  onSelectSense?: (senseId: number) => void;
}

function SearchResultCard({ word, senses, onSelectSense }: SearchResultCardProps) {
  const primarySenseId = senses[0]?.id;
  const isInteractive = typeof onSelectSense === 'function' && typeof primarySenseId === 'number';
  const Container = isInteractive ? Pressable : View;
  const handlePress = () => {
    if (isInteractive && onSelectSense && typeof primarySenseId === 'number') {
      onSelectSense(primarySenseId);
    }
  };

  const uniquePartsOfSpeech = useMemo(() => {
    const parts = new Set<string>();
    for (const sense of senses) {
      if (sense.pos) {
        parts.add(sense.pos);
      }
    }
    return Array.from(parts);
  }, [senses]);

  const previewDefinition = useMemo(() => {
    for (const sense of senses) {
      if (sense.definition?.trim()) {
        return sense.definition.trim();
      }
    }
    return '';
  }, [senses]);

  const previewExample = useMemo(() => {
    for (const sense of senses) {
      for (const example of sense.examples ?? []) {
        if (example.trim().length > 0) {
          return example.trim();
        }
      }
    }
    return '';
  }, [senses]);

  return (
    <Container
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/10 ${
        isInteractive ? 'active:bg-slate-100' : ''
      }`}
      onPress={isInteractive ? handlePress : undefined}
      accessibilityRole={isInteractive ? 'button' : undefined}
      accessibilityHint={isInteractive ? 'Open detailed view' : undefined}
    >
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1 gap-3">
          <Text className="text-2xl font-semibold text-slate-900">{word}</Text>
          {uniquePartsOfSpeech.length > 0 ? (
            <View className="flex-row flex-wrap gap-2">
              {uniquePartsOfSpeech.map((pos) => (
                <View key={pos} className="rounded-full bg-blue-50 px-3 py-1">
                  <Text className="text-xs font-semibold uppercase tracking-wide text-blue-700">{pos}</Text>
                </View>
              ))}
            </View>
          ) : null}
          {previewDefinition ? (
            <Text className="text-base leading-6 text-slate-600" numberOfLines={3}>
              {previewDefinition}
            </Text>
          ) : null}
        </View>
        {isInteractive ? (
          <View className="rounded-xl bg-blue-50 p-2">
            <Ionicons name="open-outline" size={18} color="#1d4ed8" />
          </View>
        ) : null}
      </View>

      <View className="mt-4 flex-row flex-wrap items-center justify-between gap-3">
        <Text className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
          {senses.length === 1 ? 'Single sense available' : `${senses.length} senses available`}
        </Text>
        {previewExample ? (
          <Text className="text-xs text-slate-400" numberOfLines={1}>
            “{previewExample}”
          </Text>
        ) : null}
      </View>
    </Container>
  );
}

export default memo(SearchResultCard);
