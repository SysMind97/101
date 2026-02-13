import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import clsx from 'clsx';
import { Tile } from '../types';

interface TileItemProps {
  tile: Tile;
  onPress: () => void;
  onLongPress: () => void;
}

const COLOR_MAP: Record<string, string> = {
  red: 'text-red-600',
  black: 'text-black',
  blue: 'text-blue-600',
  yellow: 'text-yellow-500', // Yellow might need a darker shade for readability on white
};

export default function TileItem({ tile, onPress, onLongPress }: TileItemProps) {
  const textColorClass = tile.color ? COLOR_MAP[tile.color] || 'text-gray-800' : 'text-gray-400';

  return (
    <TouchableOpacity 
      onPress={onPress} 
      onLongPress={onLongPress}
      className="w-16 h-20 bg-white m-1 rounded-md shadow-sm border border-gray-200 items-center justify-center relative"
    >
      {/* False Joker Indicator */}
      {tile.isFalseJoker && (
        <View className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
      )}
      
      <Text className={clsx("text-3xl font-bold", textColorClass)}>
        {tile.isFalseJoker ? '★' : tile.value}
      </Text>
      
      {/* Small indicator for color blind accessibility or if color is subtle */}
      <View className={clsx("w-full h-1 absolute bottom-0", 
        tile.color === 'red' && "bg-red-500",
        tile.color === 'black' && "bg-black",
        tile.color === 'blue' && "bg-blue-500",
        tile.color === 'yellow' && "bg-yellow-400",
      )} />
    </TouchableOpacity>
  );
}
