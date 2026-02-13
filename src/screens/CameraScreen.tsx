import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store';

export default function CameraScreen() {
  const navigation = useNavigation<any>();
  const setScannedImage = useAppStore((state) => state.setScannedImage);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-center mb-4 text-lg">We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo?.uri) {
          setScannedImage(photo.uri);
          navigation.navigate('Processing');
        }
      } catch (error) {
        console.error("Failed to take picture:", error);
      }
    }
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        style={{ flex: 1 }} 
        facing={facing}
        ref={cameraRef}
      >
        <View className="flex-1 bg-transparent justify-end items-center pb-12">
          {/* Guide Overlay */}
          <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center pointer-events-none">
             <View className="w-[85%] h-32 border-2 border-white/70 rounded-lg bg-transparent" />
             <Text className="text-white/80 mt-4 bg-black/40 px-3 py-1 rounded">Align Board Here</Text>
          </View>

          {/* Controls */}
          <View className="flex-row justify-around items-center w-full px-8">
            <TouchableOpacity 
              className="w-12 h-12 rounded-full bg-gray-800/60 justify-center items-center"
              onPress={toggleCameraFacing}
            >
              <Text className="text-white text-xs">Flip</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className="w-20 h-20 rounded-full border-4 border-white bg-white/20 justify-center items-center"
              onPress={takePicture}
            >
              <View className="w-16 h-16 rounded-full bg-white" />
            </TouchableOpacity>
            
            <View className="w-12" /> 
          </View>
        </View>
      </CameraView>
    </View>
  );
}

