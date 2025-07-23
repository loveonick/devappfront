import { View, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface Props {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar = ({ placeholder, value, onChangeText }: Props) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-3 py-2">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={'#9CA3AF'}
          className="flex-1 ml-2 text-gray-700"
          returnKeyType="search"
        />
    </View>
  )
}

export default SearchBar