import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

interface DishTypeTagsProps {
  dishTypes: string[];
  selectedDishType: string;
  onSelectDishType: (type: string) => void;
}

const Tags = ({ dishTypes, selectedDishType, onSelectDishType }: DishTypeTagsProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 p-3">
      {dishTypes.map((type) => {
        const isSelected = selectedDishType === type;
        return (
          <TouchableOpacity
            key={type}
            onPress={() => onSelectDishType(type)}
            className={`mr-2 px-3 py-2 rounded-full border ${
              isSelected ? 'bg-colorboton border-colorboton' : 'border-gray-200'
            }`}
          >
            <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-black'}`}>
              {type}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default Tags;
