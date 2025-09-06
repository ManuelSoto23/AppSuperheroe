import React, { useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { useApp } from "../context/AppContext";
import { SuperheroCard } from "../components/SuperheroCard";
import { SearchBar } from "../components/SearchBar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Superhero } from "../types";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, commonStyles } from "../theme";

interface FavoritesScreenProps {
  navigation: any;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  navigation,
}) => {
  const { favorites, loading, removeFromFavorites } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) {
      return favorites;
    }

    const query = searchQuery.toLowerCase();
    return favorites.filter(
      (hero) =>
        hero.name.toLowerCase().includes(query) ||
        hero.biography.fullName.toLowerCase().includes(query) ||
        hero.biography.aliases.some((alias) =>
          alias.toLowerCase().includes(query)
        )
    );
  }, [favorites, searchQuery]);

  const handleToggleFavorite = async (superhero: Superhero) => {
    try {
      await removeFromFavorites(superhero.id);
    } catch (error) {
      Alert.alert("Error", "Could not remove from favorites");
    }
  };

  const renderSuperhero = ({ item }: { item: Superhero }) => (
    <SuperheroCard
      superhero={item}
      onToggleFavorite={handleToggleFavorite}
      onPress={() =>
        navigation.navigate("SuperheroDetail", { superhero: item })
      }
    />
  );

  if (loading) {
    return <LoadingSpinner message="Loading favorites..." />;
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Favorites</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search favorites"
        />
      </View>

      <FlatList
        data={filteredFavorites}
        renderItem={renderSuperhero}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color={colors.accent} />
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No favorite superheroes found"
                : "You have no favorite superheroes"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery
                ? "Try a different search term"
                : "Tap the heart on any superhero to add them to favorites."}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: spacing.xxxl,
    minHeight: 200,
  },
  emptyText: {
    fontSize: typography.xl,
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    fontWeight: typography.semibold,
  },
  emptySubtext: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
