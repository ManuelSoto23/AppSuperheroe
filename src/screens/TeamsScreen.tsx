import React from "react";
import { View, Text } from "react-native";
import { commonStyles } from "../theme";

export const TeamsScreen: React.FC = () => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Teams</Text>
      <Text style={commonStyles.body}>This is the teams screen</Text>
    </View>
  );
};
