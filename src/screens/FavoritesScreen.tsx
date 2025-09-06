import React from "react";
import { View, Text } from "react-native";
import { commonStyles } from "../theme";

export const FavoritesScreen: React.FC = () => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Favorites</Text>
      <Text style={commonStyles.body}>This is the favorites screen</Text>
    </View>
  );
};
