import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useApp } from "../context/AppContext";
import { SuperheroCard } from "../components/SuperheroCard";
import { SearchBar } from "../components/SearchBar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Superhero } from "../types";
import { colors, typography, spacing, commonStyles } from "../theme";

interface SuperheroesScreenProps {
  navigation: any;
}

export const SuperheroesScreen: React.FC<SuperheroesScreenProps> = ({
  navigation,
}) => {
  const {
    superheroes,
    loading,
    addToFavorites,
    removeFromFavorites,
    refreshSuperheroes,
    searchSuperheroes,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchResults, setSearchResults] = useState<Superhero[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const filteredSuperheroes = useMemo(() => {
    if (!searchQuery.trim()) {
      return superheroes;
    }
    return searchResults;
  }, [superheroes, searchQuery, searchResults]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchSuperheroes(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = async (superhero: Superhero) => {
    try {
      if (superhero.isFavorite) {
        await removeFromFavorites(superhero.id);
      } else {
        await addToFavorites(superhero);
      }
    } catch (error) {
      Alert.alert("Error", "Could not update favorites");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshSuperheroes();
    } catch (error) {
      Alert.alert("Error", "Could not update the list");
    } finally {
      setRefreshing(false);
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

  if (loading && superheroes.length === 0) {
    return <LoadingSpinner message="Loading superheroes..." />;
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Superheroes</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search superheroes..."
        />
      </View>

      <FlatList
        data={filteredSuperheroes}
        renderItem={renderSuperhero}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.secondary]}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ListEmptyComponent={
          isSearching ? (
            <View style={styles.loadingContainer}>
              <LoadingSpinner message="Searching..." />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? "No superheroes found"
                  : "No superheroes available"}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 50,
    paddingBottom: spacing.lg,
  },
  flatList: {
    flex: 1,
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
    paddingVertical: 40,
    minHeight: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 200,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
