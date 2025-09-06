import React from "react";
import { View, Text } from "react-native";
import { commonStyles } from "../theme";
import { LoadingSpinner } from "../components/LoadingSpinner";

export const SuperheroesScreen: React.FC = () => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Superhéroes</Text>
      <LoadingSpinner message="Cargando superhéroes..." />
    </View>
  );
};
