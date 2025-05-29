import { View, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface Props {
    placeholder: string;
    onPress?: () => void;
}

const SearchBar = ({placeholder,onPress}: Props) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-3 py-1">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
            onPress={onPress}
            placeholder={placeholder}
            value=""
            onChangeText={() => {}}
            className="flex-1 ml-2 text-gray-500"
        />
    </View>
  )
}

export default SearchBar