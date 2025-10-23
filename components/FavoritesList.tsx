import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Star, Trash2 } from 'lucide-react-native';
import { Favorite } from '@/types/dictionary';
import { getLanguageByCode } from '@/data/languages';

interface FavoritesListProps {
  favorites: Favorite[];
  onSelectFavorite: (favorite: Favorite) => void;
  onRemoveFavorite: (id: string) => void;
}

export default function FavoritesList({ 
  favorites, 
  onSelectFavorite,
  onRemoveFavorite 
}: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <View className="bg-white rounded-2xl shadow-lg shadow-black/10 p-6 border border-gray-100">
        <View className="flex-row items-center mb-4">
          <Star size={20} color="#F59E0B" fill="#F59E0B" />
          <Text className="text-lg font-bold text-gray-900 ml-2">Favorites</Text>
        </View>
        <Text className="text-center text-gray-500 py-8">No favorites yet</Text>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl shadow-lg shadow-black/10 p-6 border border-gray-100">
      <View className="flex-row items-center mb-4">
        <Star size={20} color="#F59E0B" fill="#F59E0B" />
        <Text className="text-lg font-bold text-gray-900 ml-2">Favorites</Text>
      </View>
      <View className="space-y-3">
        {favorites.map((favorite) => {
          const sourceLang = getLanguageByCode(favorite.sourceLanguage);
          const targetLang = getLanguageByCode(favorite.targetLanguage);
          return (
            <TouchableOpacity
              key={favorite.id}
              onPress={() => onSelectFavorite(favorite)}
              className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex-row items-center justify-between"
            >
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Text className="text-base font-semibold text-gray-900">
                    {favorite.word}
                  </Text>
                  <Text className="text-gray-400 mx-2">→</Text>
                  <Text className="text-base font-semibold text-gray-900">
                    {favorite.translation}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-xs">{sourceLang?.flag}</Text>
                  <Text className="text-xs text-gray-500 mx-1">to</Text>
                  <Text className="text-xs">{targetLang?.flag}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => onRemoveFavorite(favorite.id)}
                className="ml-3 p-2"
              >
                <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
