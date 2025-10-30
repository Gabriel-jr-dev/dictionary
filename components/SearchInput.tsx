import { useCallback, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ArrowRight, Search, X } from 'lucide-react-native';

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
      className={`flex-row items-center gap-3 rounded-[28px] border px-4 py-3 shadow-lg shadow-slate-200/60 ${
        isFocused ? 'border-blue-500 bg-white' : 'border-transparent bg-white/95'
      }`}
    >
      <View className={`rounded-2xl p-2 ${isFocused ? 'bg-blue-100/80' : 'bg-slate-100/80'}`}>
        <Search size={18} color={isFocused ? '#1d4ed8' : '#475569'} />
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
          className="rounded-2xl bg-slate-100 px-2 py-2"
        >
          <X size={16} color="#475569" />
        </Pressable>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Search dictionary"
        onPress={handleSubmit}
        disabled={disabled}
        className={`flex-row items-center gap-2 rounded-2xl px-4 py-2 ${
          disabled ? 'bg-slate-200' : 'bg-blue-600 shadow-md shadow-blue-500/30'
        }`}
      >
        <Text className={`text-sm font-semibold ${disabled ? 'text-slate-500' : 'text-white'}`}>Search</Text>
        {!disabled ? <ArrowRight size={16} color="#ffffff" /> : null}
      </Pressable>
    </View>
  );
}
