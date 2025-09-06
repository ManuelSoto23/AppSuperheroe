import React from "react";
import { View, Text } from "react-native";
import { commonStyles } from "../theme";

export const SearchSuperheroScreen: React.FC = () => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Search Superhero</Text>
      <Text style={commonStyles.body}>This is the search superhero screen</Text>
    </View>
  );
};
