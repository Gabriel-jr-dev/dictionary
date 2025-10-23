import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingBag } from 'lucide-react-native';
import Store from '@/components/Store';
import { useStore } from '@/context/StoreContext';
import '../global.css';

export default function StoreScreen() {
  const { storeItems, handlePurchase } = useStore();

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <ShoppingBag size={32} color="#10B981" />
              <Text className="text-3xl font-bold text-gray-900 ml-3">Premium Store</Text>
            </View>
            <Text className="text-base text-gray-600">
              Unlock premium languages and features
            </Text>
          </View>

          <Store items={storeItems} onPurchase={handlePurchase} variant="screen" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}