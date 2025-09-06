import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { Superhero } from "../types";
import { OptimizedImage } from "../components/OptimizedImage";
import { colors, typography, spacing, commonStyles } from "../theme";

interface SuperheroDetailScreenProps {
  route: {
    params: {
      superhero: Superhero;
    };
  };
  navigation: any;
}

export const SuperheroDetailScreen: React.FC<SuperheroDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { superhero: initialSuperhero } = route.params;
  const { addToFavorites, removeFromFavorites, favorites, superheroes } =
    useApp();

  const [isFavorite, setIsFavorite] = useState(initialSuperhero.isFavorite);

  const superhero =
    favorites.find((fav) => fav.id === initialSuperhero.id) ||
    superheroes.find((hero) => hero.id === initialSuperhero.id) ||
    initialSuperhero;

  useEffect(() => {
    const currentHero =
      favorites.find((fav) => fav.id === initialSuperhero.id) ||
      superheroes.find((hero) => hero.id === initialSuperhero.id) ||
      initialSuperhero;
    setIsFavorite(currentHero?.isFavorite || false);
  }, [favorites, superheroes, initialSuperhero.id]);

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(superhero.id);
        setIsFavorite(false);
      } else {
        await addToFavorites(superhero);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const StatItem = ({
    label,
    value,
    color = "#FFFFFF",
  }: {
    label: string;
    value: string | number;
    color?: string;
  }) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}:</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  const PowerStatItem = ({
    label,
    value,
    maxValue = 100,
  }: {
    label: string;
    value: number;
    maxValue?: number;
  }) => {
    const percentage = (value / maxValue) * 100;
    const getColor = (val: number) => {
      if (val >= 80) return "#4CAF50";
      if (val >= 60) return "#FFC107";
      if (val >= 40) return "#FF9800";
      return "#F44336";
    };

    return (
      <View style={styles.powerStatItem}>
        <Text style={styles.powerStatLabel}>{label}</Text>
        <View style={styles.powerStatBar}>
          <View
            style={[
              styles.powerStatFill,
              {
                width: `${percentage}%`,
                backgroundColor: getColor(value),
              },
            ]}
          />
        </View>
        <Text style={styles.powerStatValue}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <OptimizedImage
            superhero={superhero}
            size="lg"
            style={styles.heroImage}
          />

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? colors.accent : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.heroName}>{superhero.name}</Text>

          <View style={styles.basicInfo}>
            <StatItem
              label="Real Name"
              value={superhero.biography.fullName || "Unknown"}
            />
            <StatItem
              label="Alter egos"
              value={superhero.biography.alterEgos || "None"}
            />
          </View>

          <View style={styles.powerStatsSection}>
            <PowerStatItem
              label="Intelligence"
              value={parseInt(superhero.powerstats.intelligence)}
            />
            <PowerStatItem
              label="Strength"
              value={parseInt(superhero.powerstats.strength)}
            />
            <PowerStatItem
              label="Speed"
              value={parseInt(superhero.powerstats.speed)}
            />
            <PowerStatItem
              label="Durability"
              value={parseInt(superhero.powerstats.durability)}
            />
            <PowerStatItem
              label="Power"
              value={parseInt(superhero.powerstats.power)}
            />
            <PowerStatItem
              label="Combat"
              value={parseInt(superhero.powerstats.combat)}
            />

            <View style={styles.averageScoreContainer}>
              <View style={styles.averageScoreRow}>
                <Ionicons name="flash" size={20} color="#FFD700" />
                <Text style={styles.averageScoreLabel}>Avg. Score:</Text>
                <Text style={styles.averageScoreValue}>
                  {superhero.powerScore?.toFixed(0) || 0} / 100
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  imageContainer: {
    position: "relative",
    height: 400,
    marginTop: 10,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  headerButtons: {
    position: "absolute",
    top: 30,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    backgroundColor: colors.secondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
    minHeight: "100%",
  },
  heroName: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  basicInfo: {
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  statLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    flex: 1,
    fontWeight: "600",
  },
  statValue: {
    fontSize: 16,
    color: "#FFFFFF",
    flex: 2,
    textAlign: "right",
  },
  powerStatsSection: {
    marginTop: 20,
  },
  powerStatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  powerStatLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    flex: 1,
    fontWeight: "600",
  },
  powerStatBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    flex: 2,
    marginHorizontal: 12,
  },
  powerStatFill: {
    height: "100%",
    borderRadius: 2,
  },
  powerStatValue: {
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "right",
    minWidth: 30,
  },
  averageScoreContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  averageScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  averageScoreLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  averageScoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
    marginLeft: 8,
  },
});
