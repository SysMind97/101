import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import clsx from 'clsx';
import { Tile, TileColor } from '../types';

interface EditTileModalProps {
  visible: boolean;
  tile: Tile | null; // null means adding a new tile
  onClose: () => void;
  onSave: (tile: Partial<Tile>) => void;
}

const COLORS: TileColor[] = ['red', 'black', 'blue', 'yellow'];
const VALUES = Array.from({ length: 13 }, (_, i) => i + 1);

export default function EditTileModal({ visible, tile, onClose, onSave }: EditTileModalProps) {
  // Local state for editing
  const [value, setValue] = useState<number>(1);
  const [color, setColor] = useState<TileColor>('red');
  const [isFalseJoker, setIsFalseJoker] = useState(false);

  useEffect(() => {
    if (tile) {
      setValue(tile.value === 0 ? 1 : tile.value);
      setColor(tile.color || 'red');
      setIsFalseJoker(!!tile.isFalseJoker);
    } else {
      // Defaults for new tile
      setValue(1);
      setColor('red');
      setIsFalseJoker(false);
    }
  }, [tile, visible]);

  const handleSave = () => {
    if (isFalseJoker) {
      onSave({
        value: 0,
        color: null, // or keep color if relevant
        isFalseJoker: true,
      });
    } else {
      onSave({
        value,
        color,
        isFalseJoker: false,
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6 h-[70%]">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">{tile ? 'Edit Tile' : 'Add Tile'}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-600 text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* False Joker Toggle */}
            <View className="mb-6 flex-row items-center justify-between bg-gray-50 p-4 rounded-xl">
              <Text className="text-lg font-medium">False Joker (Symbo)</Text>
              <TouchableOpacity
                onPress={() => setIsFalseJoker(!isFalseJoker)}
                className={clsx("w-14 h-8 rounded-full justify-center transition-all", isFalseJoker ? "bg-purple-500" : "bg-gray-300")}
              >
                 <View className={clsx("w-6 h-6 bg-white rounded-full shadow-sm m-1", isFalseJoker ? "translate-x-6" : "")} />
              </TouchableOpacity>
            </View>

            {!isFalseJoker && (
              <>
                {/* Color Selection */}
                <Text className="text-gray-500 mb-2 font-medium">Color</Text>
                <View className="flex-row gap-4 mb-6">
                  {COLORS.map((c) => (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setColor(c)}
                      className={clsx(
                        "w-16 h-16 rounded-full border-4 items-center justify-center",
                        color === c ? "border-green-500" : "border-transparent",
                        c === 'red' && "bg-red-500",
                        c === 'black' && "bg-black",
                        c === 'blue' && "bg-blue-500",
                        c === 'yellow' && "bg-yellow-400"
                      )}
                    />
                  ))}
                </View>

                {/* Value Selection */}
                <Text className="text-gray-500 mb-2 font-medium">Value</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {VALUES.map((v) => (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setValue(v)}
                      className={clsx(
                        "w-12 h-12 rounded-lg items-center justify-center border",
                        value === v ? "bg-blue-100 border-blue-500" : "bg-white border-gray-200"
                      )}
                    >
                      <Text className={clsx("text-lg font-bold", value === v ? "text-blue-600" : "text-gray-700")}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity 
              className="bg-blue-600 py-4 rounded-xl items-center mt-4"
              onPress={handleSave}
            >
              <Text className="text-white text-lg font-bold">Save Tile</Text>
            </TouchableOpacity>
            
            <View className="h-12" /> 
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
