import React from "react";
import { View, Text } from "react-native";
import { commonStyles } from "../theme";

export const AddMemberScreen: React.FC = () => {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Add Member</Text>
      <Text style={commonStyles.body}>This is the add member screen</Text>
    </View>
  );
};
