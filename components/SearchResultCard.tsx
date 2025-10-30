import { memo, useMemo } from 'react';
import { Pressable, Text } from 'react-native';
import type { DictionarySense } from '@/types/dictionary';

interface SearchResultCardProps {
  word: string;
  senses: DictionarySense[];
  onPress?: (senseId: number) => void;
}

function SearchResultCard({ word, senses, onPress }: SearchResultCardProps) {
  const firstSenseId = useMemo(() => senses[0]?.id, [senses]);

  return (
    <Pressable
      className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm"
      onPress={onPress && firstSenseId ? () => onPress(firstSenseId) : undefined}
      accessibilityRole="button"
      accessibilityLabel={`Open definitions for ${word}`}
      accessibilityState={{ disabled: !onPress || !firstSenseId }}
    >
      <Text className="text-2xl font-semibold text-slate-900">{word}</Text>
    </Pressable>
  );
}

export default memo(SearchResultCard);
