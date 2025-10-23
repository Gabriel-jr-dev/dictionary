import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
  isDarkMode?: boolean;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onSearch,
  placeholder = 'Search for a word...',
  isDarkMode = false
}: SearchBarProps) {
  return (
    <View className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg shadow-black/10 flex-row items-center px-4 py-3 border`}>
      <Search size={20} color={isDarkMode ? "#9CA3AF" : "#9CA3AF"} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? "#6B7280" : "#9CA3AF"}
        className={`flex-1 ml-3 text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} className="ml-2">
          <X size={20} color={isDarkMode ? "#9CA3AF" : "#9CA3AF"} />
        </TouchableOpacity>
      )}
    </View>
  );
}