import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { analyzeImageWithGPT4 } from '../services/openaiOCR';
import { useAppStore } from '../store';

export default function ProcessingScreen() {
  const navigation = useNavigation<any>();
  const setTiles = useAppStore((state) => state.setTiles);
  const scannedImage = useAppStore((state) => state.scannedImage);

  useEffect(() => {
    const processImage = async () => {
      if (!scannedImage) {
        Alert.alert("Error", "No image to process");
        navigation.goBack();
        return;
      }

      try {
        const result = await analyzeImageWithGPT4(scannedImage);
        
        if (result.tiles.length === 0) {
           Alert.alert("No Tiles Found", "Could not identify any tiles. Please try again or check internet connection.", [
             { text: "Retry", onPress: () => navigation.goBack() }
           ]);
           return;
        }

        setTiles(result.tiles);
        navigation.replace('Verification');
      } catch (e) {
        Alert.alert("Error", "Failed to analyze image.");
        navigation.goBack();
      }
    };
    
    // Small delay to allow UI to render before heavy task
    setTimeout(processImage, 500);
  }, [scannedImage]);

  return (
    <View className="flex-1 items-center justify-center bg-white p-8">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="mt-8 text-xl font-bold text-gray-800 text-center">Analyzing Board with AI...</Text>
      <Text className="mt-2 text-gray-500 text-center">This may take a few seconds.</Text>
    </View>
  );
}
