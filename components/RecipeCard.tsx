import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

interface Props {
    imgsrc: any;
    title: string;
    description: string;
    tags: string[];

}

const RecipeCard = ({imgsrc,title,description,tags}:Props) => {
  return (
    <View className="flex-row mb-4 bg-white rounded-xl shadow p-2">
        <Image source={imgsrc} className="w-24 h-24 rounded-xl mr-2" />
        <View className="flex-1">
        <View className="flex-row justify-between">
            <Text className="font-bold text-base">{title}</Text>
            <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color="black" />
            </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-600 mb-2">{description}</Text>
        <View className="flex-row flex-wrap">
            {tags.map((tag, j) => (
            <Text key={j} className="text-xs bg-colortag text-white px-2 py-1 rounded-full mr-1 mb-1">
                {tag}
            </Text>
            ))}
        </View>
        </View>
    </View>
)
}

export default RecipeCard