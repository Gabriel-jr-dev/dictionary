import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Package } from 'lucide-react-native';
import LanguagePackages from '@/components/LanguagePackages';
import { useStore } from '@/context/StoreContext';
import { useRouter } from 'expo-router';
import '../global.css';

export default function LanguagesScreen() {
  const { languages, handleDownloadLanguage } = useStore();
  const router = useRouter();

  const handlePurchaseLanguage = (languageCode: string) => {
    router.push('/store' as any);
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4">
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <Package size={32} color="#8B5CF6" />
              <Text className="text-3xl font-bold text-gray-900 ml-3">Languages</Text>
            </View>
            <Text className="text-base text-gray-600">
              Download language packs for offline use
            </Text>
          </View>

          <LanguagePackages
            languages={languages}
            onDownload={handleDownloadLanguage}
            onPurchase={handlePurchaseLanguage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
