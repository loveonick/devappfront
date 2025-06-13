import { View, Text, Touchable, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'


interface TagsProps {
  categories: Category[];
}
type Category = {
  category: string;
  title: string;
};

const Tags = (props: TagsProps) => {
      const categories = props.categories;
    const params = useLocalSearchParams<{filter?:string}>()
    const [selectedCategory,setSelectedCategory] = React.useState(params.filter || 'Todos');
    const handleCategoryPress = (category: string) => {}

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 p-3">
            {categories.map((item,index) =>(
            <TouchableOpacity onPress={() => handleCategoryPress(item.category)} className={`px-4 py-2 bg-white rounded-full mr-2 shadow ${selectedCategory === item.category ? 'bg-colorboton' : 'bg-primary-100 border border-primary-200'}`} key={index}>
                <Text className={`text-sm ${selectedCategory === item.category ? 'text-black' : 'text-black'}`}>{item.title}</Text>
            </TouchableOpacity>
            ))}
        </ScrollView>
    )
}

export default Tags