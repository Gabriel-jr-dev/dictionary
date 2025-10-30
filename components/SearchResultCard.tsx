import { memo, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { DictionarySense } from '@/types/dictionary';

interface SearchResultCardProps {
  word: string;
  senses: DictionarySense[];
  onSelectSense?: (senseId: number) => void;
}

function SearchResultCard({ word, senses, onSelectSense }: SearchResultCardProps) {
  const firstSenseId = useMemo(() => senses[0]?.id, [senses]);
  const partsOfSpeech = useMemo(() => {
    if (senses.length === 0) {
      return [] as string[];
    }

    return Array.from(
      new Set(
        senses
          .map((sense) => sense.pos)
          .filter((pos): pos is string => typeof pos === 'string' && pos.length > 0)
      )
    );
  }, [senses]);

  const senseCount = senses.length;

  return (
    <Pressable
      className="rounded-2xl border border-slate-200 bg-white px-5 py-6 shadow-sm"
      onPress={onSelectSense && firstSenseId ? () => onSelectSense(firstSenseId) : undefined}
      accessibilityRole="button"
      accessibilityLabel={`Open definitions for ${word}`}
      accessibilityState={{ disabled: !onSelectSense || !firstSenseId }}
    >
      <View className="gap-2">
        <Text className="text-2xl font-semibold text-slate-900">{word}</Text>
        {partsOfSpeech.length > 0 ? (
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {partsOfSpeech.join(' • ')}
          </Text>
        ) : null}
        {Number.isFinite(senseCount) && senseCount > 0 ? (
          <Text className="text-sm text-slate-500">
            {senseCount === 1 ? '1 definition available' : `${senseCount} definitions available`}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default memo(SearchResultCard);
