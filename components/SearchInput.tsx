import { useCallback, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: (text: string) => void;
  disabled?: boolean;
}

export default function SearchInput({
  value,
  placeholder = 'Search for a word',
  onChangeText,
  onSubmit,
  disabled = false,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = useCallback(() => {
    if (!disabled && onSubmit) {
      onSubmit(value.trim());
    }
  }, [disabled, onSubmit, value]);

  return (
    <View
      className={`flex-row items-center rounded-2xl border px-4 py-3 gap-3 ${
        isFocused ? 'border-blue-500 bg-white/90' : 'border-slate-200 bg-white'
      }`}
    >
      <Search size={20} color={isFocused ? '#2563eb' : '#64748b'} />
      <TextInput
        className="flex-1 text-base text-slate-900"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        editable={!disabled}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search dictionary"
        onPress={handleSubmit}
        disabled={disabled}
        className={`rounded-xl px-3 py-2 ${
          disabled ? 'bg-slate-200' : 'bg-blue-600'
        }`}
      >
        <Text className={`text-sm font-semibold ${disabled ? 'text-slate-500' : 'text-white'}`}>
          Search
        </Text>
      </Pressable>
    </View>
  );
}
