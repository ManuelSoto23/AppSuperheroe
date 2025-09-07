import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Buscar...",
  onClear,
}) => {
  const handleClear = () => {
    onChangeText("");
    onClear?.();
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        size={20}
        color={colors.textSecondary}
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons
            name="close-circle"
            size={20}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.xxxl,
    marginBottom: spacing.sm,
    minHeight: 42,
  },
  icon: {
    marginRight: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: typography.md,
    color: colors.text,
    paddingVertical: 2,
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
});
