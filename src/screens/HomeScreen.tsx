import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Text className="text-3xl font-bold mb-8 text-blue-600">101 Okey Counter</Text>
      <TouchableOpacity 
        className="bg-blue-500 px-8 py-4 rounded-full"
        onPress={() => navigation.navigate('Camera')}
      >
        <Text className="text-white text-lg font-semibold">Scan Board</Text>
      </TouchableOpacity>
    </View>
  );
}
