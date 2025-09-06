import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Superhero } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing } from "../theme";

interface SuperheroCardProps {
  superhero: Superhero;
  onToggleFavorite: (superhero: Superhero) => void;
  onPress?: () => void;
}

export const SuperheroCard: React.FC<SuperheroCardProps> = ({
  superhero,
  onToggleFavorite,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: superhero.images.md }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(superhero)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={superhero.isFavorite ? "heart" : "heart-outline"}
              size={18}
              color={superhero.isFavorite ? colors.accent : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {superhero.name}
        </Text>
        <Text style={styles.realName} numberOfLines={2}>
          {superhero.biography.fullName || "Real name unknown"}
        </Text>

        {/* Puntuación de poder con icono */}
        <View style={styles.powerSection}>
          <View style={styles.powerIcon}>
            <Ionicons name="flash" size={14} color={colors.gold} />
          </View>
          <Text style={styles.powerScore}>
            {superhero.powerScore?.toFixed(0) || 0}
          </Text>
          <Text style={styles.powerMax}>/ 100</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 4,
    flexDirection: "row",
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    minHeight: 200,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    width: 200,
    height: 200,
    marginRight: 0,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 8,
  },
  favoriteButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    paddingLeft: spacing.md,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  name: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: 4,
  },
  realName: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  powerSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  powerIcon: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderRadius: 8,
    padding: 4,
    marginRight: 8,
  },
  powerScore: {
    fontSize: typography.md,
    color: colors.gold,
    fontWeight: typography.bold,
  },
  powerMax: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginLeft: 2,
  },
});
