import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
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

  return (
    <Container
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
      onPress={isInteractive ? handlePress : undefined}
      accessibilityRole={isInteractive ? 'button' : undefined}
      accessibilityHint={isInteractive ? 'Open detailed view' : undefined}
    >
      <Text className="text-2xl font-semibold text-blue-600">{word}</Text>
    </Container>
  );
}

export default memo(SearchResultCard);
