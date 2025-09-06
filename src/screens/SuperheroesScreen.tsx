import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { SuperheroCard } from "../components/SuperheroCard";
import { SearchBar } from "../components/SearchBar";
import { commonStyles } from "../theme";

export const SuperheroesScreen: React.FC = () => {
  const { superheroes, loading, addToFavorites, removeFromFavorites } =
    useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSuperheroes = superheroes.filter((hero) =>
    hero.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavoritePress = (superhero: any) => {
    if (superhero.isFavorite) {
      removeFromFavorites(superhero.id);
    } else {
      addToFavorites(superhero);
    }
  };

  const renderSuperhero = ({ item }: { item: any }) => (
    <SuperheroCard
      superhero={item}
      onPress={() => {
        // TODO: Navegar a la pantalla de detalles del superhéroe
      }}
      onFavoritePress={() => handleFavoritePress(item)}
    />
  );

  if (loading) {
    return <LoadingSpinner message="Loading superheroes..." />;
  }

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Superheroes</Text>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search superheroes..."
      />
      <FlatList
        data={filteredSuperheroes}
        renderItem={renderSuperhero}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No superheroes found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
});
