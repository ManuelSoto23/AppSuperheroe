import React from "react";
import { View, Text } from "react-native";
import { commonStyles } from "../theme";

export const SuperheroDetailScreen: React.FC = () => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Superhero Detail</Text>
      <Text style={commonStyles.body}>This is the superhero detail screen</Text>
    </View>
  );
};
