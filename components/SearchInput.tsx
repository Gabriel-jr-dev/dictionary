import { useCallback, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  const showClear = value.length > 0 && !disabled;

  const handleSubmit = useCallback(() => {
    if (!disabled && onSubmit) {
      onSubmit(value.trim());
    }
  }, [disabled, onSubmit, value]);

  const handleClear = useCallback(() => {
    if (!disabled) {
      onChangeText?.('');
    }
  }, [disabled, onChangeText]);

  return (
    <View
      className={`flex-row items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm shadow-slate-900/5 ${
        isFocused ? 'border-blue-500 bg-white shadow-md shadow-blue-500/10' : 'border-transparent bg-white/95'
      }`}
    >
      <View className={`rounded-xl p-2 ${isFocused ? 'bg-blue-50' : 'bg-slate-100/70'}`}>
        <Ionicons name="search" size={18} color={isFocused ? '#1d4ed8' : '#475569'} />
      </View>
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
      {showClear ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={handleClear}
          className="rounded-xl bg-slate-100/90 p-2"
        >
          <Ionicons name="close" size={16} color="#475569" />
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search dictionary"
        onPress={handleSubmit}
        disabled={disabled}
        className={`flex-row items-center gap-2 rounded-2xl px-4 py-2 ${
          disabled ? 'bg-slate-200' : 'bg-blue-600 shadow-lg shadow-blue-600/20'
        }`}
      >
        <Text className={`text-sm font-semibold ${disabled ? 'text-slate-500' : 'text-white'}`}>Search</Text>
        {!disabled ? <Ionicons name="arrow-forward" size={16} color="#ffffff" /> : null}
      </Pressable>
    </View>
  );
}
