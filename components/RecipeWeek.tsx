import { View, Image, Text, TouchableOpacity } from "react-native";

interface Props {
  imgsrc: any;
  title: string;
}

const RecipeWeek = ({ imgsrc, title }: Props) => {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl m-2 flex-1"
      style={{ width: 140, height: 150 }} // Fijo para evitar que la imagen lo estire
      activeOpacity={0.8}
    >
      <Image
        source={imgsrc}
        style={{ width: '100%', height: 100, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        resizeMode="cover"
      />
      <View className="flex-1 w-full px-2 py-2 justify-center items-center" style={{ backgroundColor: '#F4F4F4' }}>
        <Text
          className="text-sm font-semibold text-center"
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeWeek;
