import { View, Text } from "react-native";
import React from "react";

const Header = () => {
  return (
     <View className="w-full h-16 bg-[#111827] items-center justify-center shadow-md">
      <Text className="text-white text-2xl font-bold">ToDo Or Nah</Text>
    </View>
  );
};

export default Header;
