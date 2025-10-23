import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Clock, Trash2 } from 'lucide-react-native';
import { SearchHistory } from '@/types/dictionary';
import { getLanguageByCode } from '@/data/languages';

interface RecentSearchesProps {
  searches: SearchHistory[];
  onSelectSearch: (search: SearchHistory) => void;
  onClearHistory: () => void;
  isDarkMode?: boolean;
}

export default function RecentSearches({ 
  searches, 
  onSelectSearch,
  onClearHistory,
  isDarkMode = false
}: RecentSearchesProps) {
  if (searches.length === 0) {
    return (
      <View className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg shadow-black/10 p-6 border`}>
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Clock size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} ml-2`}>Recent Searches</Text>
          </View>
        </View>
        <Text className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} py-8`}>No recent searches yet</Text>
      </View>
    );
  }

  return (
    <View className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl shadow-lg shadow-black/10 p-6 border`}>
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Clock size={20} color={isDarkMode ? "#9CA3AF" : "#6B7280"} />
          <Text className={`text-lg font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} ml-2`}>Recent Searches</Text>
        </View>
        <TouchableOpacity onPress={onClearHistory}>
          <Trash2 size={18} color={isDarkMode ? "#F87171" : "#EF4444"} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
        <View className="flex-row gap-3 px-2">
          {searches.slice(0, 10).map((search) => {
            const sourceLang = getLanguageByCode(search.sourceLanguage);
            const targetLang = getLanguageByCode(search.targetLanguage);
            return (
              <TouchableOpacity
                key={search.id}
                onPress={() => onSelectSearch(search)}
                className={`${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-800/50' 
                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100'
                } rounded-xl p-4 min-w-[140px] border`}
              >
                <Text className={`text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                  {search.word}
                </Text>
                <View className="flex-row items-center">
                  <Text className="text-xs">{sourceLang?.flag}</Text>
                  <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mx-1`}>→</Text>
                  <Text className="text-xs">{targetLang?.flag}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}