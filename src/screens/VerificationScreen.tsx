import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store';
import { calculateTotalScore } from '../utils/scoreCalculator';
import TileItem from '../components/TileItem';
import EditTileModal from '../components/EditTileModal';
import { Tile } from '../types';

export default function VerificationScreen() {
  const navigation = useNavigation<any>();
  const tiles = useAppStore((state) => state.tiles);
  const scannedImage = useAppStore((state) => state.scannedImage);
  const updateTile = useAppStore((state) => state.updateTile);
  const addTile = useAppStore((state) => state.addTile);
  const removeTile = useAppStore((state) => state.removeTile);
  const resetSession = useAppStore((state) => state.resetSession);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);

  const totalScore = calculateTotalScore(tiles);

  const handleTilePress = (tile: Tile) => {
    setSelectedTileId(tile.id);
    setModalVisible(true);
  };

  const handleTileLongPress = (tile: Tile) => {
    Alert.alert(
      "Remove Tile",
      "Are you sure you want to remove this tile?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeTile(tile.id) }
      ]
    );
  };

  const handleAddTile = () => {
    setSelectedTileId(null); // Indicates adding new
    setModalVisible(true);
  };

  const handleSaveTile = (updates: Partial<Tile>) => {
    if (selectedTileId) {
      // Update existing
      updateTile(selectedTileId, updates);
    } else {
      // Add new
      const newTile: Tile = {
        id: Math.random().toString(36).substring(7),
        value: updates.value || 0,
        color: updates.color || null,
        isFalseJoker: updates.isFalseJoker,
      };
      addTile(newTile);
    }
  };

  const handleConfirm = () => {
    Alert.alert("Session Finished", `Total Score: ${totalScore}`, [
      { text: "OK", onPress: () => {
        resetSession();
        navigation.navigate('Home');
      }}
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header / Top Bar */}
      <View className="px-4 py-2 bg-white shadow-sm flex-row justify-between items-center z-10">
        <Text className="text-lg font-bold">Verify Scanned Board</Text>
        <View className="bg-blue-100 px-3 py-1 rounded-lg">
           <Text className="text-blue-700 font-bold text-lg">Total: {totalScore}</Text>
        </View>
      </View>

      {/* Scanned Image Preview (Collapsible or small) */}
      {scannedImage && (
        <View className="h-40 bg-black w-full relative">
           <Image source={{ uri: scannedImage }} className="w-full h-full opacity-60" resizeMode="cover" />
           <Text className="absolute bottom-2 right-2 text-white text-xs bg-black/50 px-2 rounded">Original Image</Text>
        </View>
      )}

      {/* Tiles Grid */}
      <FlatList
        data={tiles}
        keyExtractor={(item) => item.id}
        numColumns={4}
        contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="flex-1 items-center">
            <TileItem 
              tile={item} 
              onPress={() => handleTilePress(item)} 
              onLongPress={() => handleTileLongPress(item)} 
            />
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity 
            onPress={handleAddTile}
            className="mt-4 mx-4 py-4 bg-gray-200 rounded-xl border-2 border-dashed border-gray-400 items-center justify-center"
          >
            <Text className="text-gray-600 font-bold">+ Add Missing Tile</Text>
          </TouchableOpacity>
        }
      />

      {/* Bottom Floating Action Button or Bar */}
      <View className="absolute bottom-6 left-6 right-6">
        <TouchableOpacity 
          className="bg-green-600 py-4 rounded-xl shadow-lg items-center"
          onPress={handleConfirm}
        >
          <Text className="text-white font-bold text-xl">Confirm & Finish</Text>
        </TouchableOpacity>
      </View>

      {/* Edit/Add Modal */}
      <EditTileModal
        visible={modalVisible}
        tile={selectedTileId ? tiles.find(t => t.id === selectedTileId) || null : null}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveTile}
      />
    </SafeAreaView>
  );
}

