import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star } from 'lucide-react-native';
import FavoritesList from '@/components/FavoritesList';
import { useStore } from '@/context/StoreContext';
import { AVAILABLE_LANGUAGES, searchTranslation } from '@/data/languages';
import '../global.css';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useStore();

  const handleSelectFavorite = (fav: any) => {
    // Navigation to home with pre-filled search would go here
    // For now, this is just a display screen
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Star size={32} color="#F59E0B" fill="#F59E0B" />
              <Text className="text-3xl font-bold text-gray-900 ml-3">Favorites</Text>
            </View>
            <Text className="text-base text-gray-600">
              Your saved translations
            </Text>
          </View>

          <FavoritesList
            favorites={favorites}
            onSelectFavorite={handleSelectFavorite}
            onRemoveFavorite={removeFavorite}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
