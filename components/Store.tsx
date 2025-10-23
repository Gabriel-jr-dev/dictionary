import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import { ShoppingBag, Check, Lock } from 'lucide-react-native';
import { StoreItem } from '@/types/dictionary';

interface StoreProps {
  items: StoreItem[];
  onPurchase: (itemId: string) => void;
  variant?: 'card' | 'screen';
}

export default function Store({ items, onPurchase, variant = 'card' }: StoreProps) {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handlePurchase = (item: StoreItem) => {
    Alert.alert(
      'Confirm Purchase',
      `Purchase ${item.name} for $${item.price.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: () => {
            onPurchase(item.id);
            Alert.alert('Success', `${item.name} has been unlocked!`);
          },
        },
      ]
    );
  };

  const renderStoreContent = () => (
    <View className="space-y-4">
      {items.map((item) => (
        <View
          key={item.id}
          className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 mb-4 border border-gray-200"
        >
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {item.description}
              </Text>
            </View>
            <View className="bg-emerald-100 px-3 py-1 rounded-full ml-3">
              <Text className="text-base font-bold text-emerald-700">
                ${item.price.toFixed(2)}
              </Text>
            </View>
          </View>

          {item.isPurchased ? (
            <View className="bg-green-100 rounded-lg py-3 flex-row items-center justify-center">
              <Check size={18} color="#10B981" />
              <Text className="text-green-700 font-semibold ml-2">Purchased</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => handlePurchase(item)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg py-3 flex-row items-center justify-center"
            >
              <ShoppingBag size={18} color="white" />
              <Text className="text-white font-semibold ml-2">
                Purchase for ${item.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );

  if (variant === 'screen') {
    return renderStoreContent();
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 shadow-lg shadow-emerald-500/30"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <View className="flex-row items-center mb-2">
              <ShoppingBag size={24} color="white" />
              <Text className="text-xl font-bold text-white ml-2">Premium Store</Text>
            </View>
            <Text className="text-emerald-100 text-sm">
              Unlock premium languages and features
            </Text>
          </View>
          <View className="bg-white/20 rounded-full p-3">
            <Lock size={24} color="white" />
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
              <Text className="text-2xl font-bold text-gray-900">Premium Store</Text>
              <Text className="text-sm text-gray-500 mt-1">
                Unlock premium content with micropayments
              </Text>
            </View>
            <ScrollView className="px-6 py-4">
              {renderStoreContent()}
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