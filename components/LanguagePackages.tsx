import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Download, Check, Lock, Package } from 'lucide-react-native';
import { Language } from '@/types/dictionary';

interface LanguagePackagesProps {
  languages: Language[];
  onDownload: (languageCode: string) => void;
  onPurchase: (languageCode: string) => void;
}

export default function LanguagePackages({ 
  languages, 
  onDownload,
  onPurchase 
}: LanguagePackagesProps) {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-lg shadow-purple-500/30"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <Package size={24} color="white" />
              <Text className="text-xl font-bold text-white ml-2">Language Packages</Text>
            </View>
            <Text className="text-purple-100 text-sm">
              Download languages for offline use
            </Text>
          </View>
          <View className="bg-white/20 rounded-full p-3">
            <Download size={24} color="white" />
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            <View className="p-6 border-b border-gray-200">
              <Text className="text-2xl font-bold text-gray-900">Language Packages</Text>
              <Text className="text-sm text-gray-500 mt-1">
                Download languages to use offline
              </Text>
            </View>
            <ScrollView className="px-6 py-4">
              {languages.map((language) => (
                <View
                  key={language.code}
                  className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-3xl mr-3">{language.flag}</Text>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900">
                          {language.name}
                        </Text>
                        <Text className="text-sm text-gray-500">
                          {language.nativeName} • {language.downloadSize}
                        </Text>
                      </View>
                    </View>
                    {language.isPremium && !language.isDownloaded && (
                      <View className="bg-amber-100 px-3 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-amber-700">Premium</Text>
                      </View>
                    )}
                  </View>
                  
                  {language.isDownloaded ? (
                    <View className="bg-green-100 rounded-lg py-3 flex-row items-center justify-center">
                      <Check size={18} color="#10B981" />
                      <Text className="text-green-700 font-semibold ml-2">Downloaded</Text>
                    </View>
                  ) : language.isPremium ? (
                    <TouchableOpacity
                      onPress={() => {
                        onPurchase(language.code);
                        setModalVisible(false);
                      }}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg py-3 flex-row items-center justify-center"
                    >
                      <Lock size={18} color="white" />
                      <Text className="text-white font-semibold ml-2">Purchase to Download</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => onDownload(language.code)}
                      className="bg-blue-600 rounded-lg py-3 flex-row items-center justify-center"
                    >
                      <Download size={18} color="white" />
                      <Text className="text-white font-semibold ml-2">Download</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="p-6 border-t border-gray-200"
            >
              <Text className="text-center text-base font-semibold text-blue-600">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
