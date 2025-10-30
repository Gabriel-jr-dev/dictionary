import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { DictionarySense } from '@/types/dictionary';

interface SearchResultCardProps {
  word: string;
  senses: DictionarySense[];
  onSelectSense?: (senseId: number) => void;
}

function SenseBlock({
  sense,
  onSelectSense,
}: {
  sense: DictionarySense;
  onSelectSense?: (senseId: number) => void;
}) {
  const Container = onSelectSense ? Pressable : View;

  return (
    <Container
      className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
      onPress={onSelectSense ? () => onSelectSense(sense.id) : undefined}
      accessibilityRole={onSelectSense ? 'button' : undefined}
      accessibilityHint={onSelectSense ? 'Open detailed view' : undefined}
    >
      <View className="mb-2 flex-row items-baseline justify-between gap-3">
        {sense.pos ? <Text className="text-sm uppercase tracking-wide text-slate-500">{sense.pos}</Text> : null}
        <Text className="text-xs font-medium text-slate-400">Sense {sense.sense}</Text>
      </View>
      <Text className="text-base leading-6 text-slate-700">{sense.definition}</Text>
      {sense.examples.length > 0 ? (
        <View className="mt-3 space-y-2">
          <Text className="text-xs font-semibold uppercase tracking-wide text-slate-500">Examples</Text>
          {sense.examples.map((example, index) => (
            <Text key={index} className="text-sm leading-5 text-slate-600">
              • {example}
            </Text>
          ))}
        </View>
      ) : null}
    </Container>
  );
}

function SearchResultCard({ word, senses, onSelectSense }: SearchResultCardProps) {
  const partsOfSpeech = Array.from(
    new Set(
      senses
        .map((sense) => sense.pos)
        .filter((pos): pos is string => typeof pos === 'string' && pos.length > 0)
    )
  );

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <View className="mb-2 gap-2">
        <Text className="text-2xl font-semibold text-slate-900">{word}</Text>
        {partsOfSpeech.length > 0 ? (
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {partsOfSpeech.join(' • ')}
          </Text>
        ) : null}
      </View>

      <View className="mt-2 space-y-3">
        {senses.map((sense) => (
          <SenseBlock key={sense.id} sense={sense} onSelectSense={onSelectSense} />
        ))}
      </View>
    </View>
  );
}

export default memo(SearchResultCard);
