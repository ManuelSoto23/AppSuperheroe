import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Superhero } from "../types";
import { OptimizedImage } from "./OptimizedImage";
import { colors, spacing, typography, borderRadius } from "../theme";

interface SuperheroSelectionCardProps {
  superhero: Superhero;
  isSelected: boolean;
  onToggleSelection: (superheroId: number) => void;
}

export const SuperheroSelectionCard: React.FC<SuperheroSelectionCardProps> = ({
  superhero,
  isSelected,
  onToggleSelection,
}) => {
  return (
    <TouchableOpacity
      style={[styles.superheroItem, isSelected && styles.superheroItemSelected]}
      onPress={() => onToggleSelection(superhero.id)}
    >
      <View style={styles.imageWrapper}>
        <OptimizedImage superhero={superhero} size="sm" style={styles.image} />
      </View>

      <View style={styles.superheroInfo}>
        <Text style={styles.superheroName}>{superhero.name}</Text>
        {superhero.biography.fullName && (
          <Text style={styles.superheroRealName}>
            {superhero.biography.fullName}
          </Text>
        )}
        <View style={styles.powerScoreContainer}>
          <Ionicons name="flash" size={12} color={colors.gold} />
          <Text style={styles.powerScore}>
            {superhero.powerScore?.toFixed(0) || 0}/100
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.actionButton,
          isSelected
            ? styles.actionButtonSelected
            : styles.actionButtonUnselected,
        ]}
        onPress={() => onToggleSelection(superhero.id)}
      >
        <Ionicons
          name={isSelected ? "checkmark" : "add"}
          size={20}
          color={isSelected ? colors.primary : colors.text}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  superheroItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
  },

  superheroItemSelected: {
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.gold,
  },

  imageWrapper: {
    position: "relative",
    width: 100,
    height: 120,
    marginRight: spacing.lg,
    marginLeft: -spacing.lg,
    marginTop: -spacing.lg,
    marginBottom: -spacing.lg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  superheroInfo: {
    flex: 1,
  },
  superheroName: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  superheroRealName: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  powerScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  powerScore: {
    fontSize: typography.sm,
    color: colors.gold,
    marginLeft: spacing.xs,
    fontWeight: typography.medium,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.xxxl,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonUnselected: {
    backgroundColor: colors.violet,
  },
  actionButtonSelected: {
    backgroundColor: colors.gold,
  },
});
