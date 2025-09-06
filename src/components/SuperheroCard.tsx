import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../theme";
import { Superhero } from "../types";

interface SuperheroCardProps {
  superhero: Superhero;
  onPress: () => void;
  onFavoritePress: () => void;
}

export const SuperheroCard: React.FC<SuperheroCardProps> = ({
  superhero,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.name}>{superhero.name}</Text>
          <Text style={styles.publisher}>{superhero.biography.publisher}</Text>
          <Text style={styles.powerScore}>
            Power Score: {superhero.powerScore || 0}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Ionicons
            name={superhero.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={superhero.isFavorite ? colors.gold : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    marginVertical: spacing.sm,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  publisher: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  powerScore: {
    fontSize: typography.sm,
    color: colors.accent,
    fontWeight: typography.semibold,
  },
  favoriteButton: {
    padding: spacing.sm,
  },
});
