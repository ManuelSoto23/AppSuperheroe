import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useApp } from "../context/AppContext";
import { SuperheroCard } from "../components/SuperheroCard";
import { commonStyles } from "../theme";

interface FavoritesScreenProps {
  navigation: any;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  navigation,
}) => {
  const { favorites, removeFromFavorites } = useApp();

  const handleFavoritePress = (superhero: any) => {
    removeFromFavorites(superhero.id);
  };

  const renderSuperhero = ({ item }: { item: any }) => (
    <SuperheroCard
      superhero={item}
      onToggleFavorite={handleFavoritePress}
      onPress={() => {
        navigation.navigate("SuperheroDetail", { superhero: item });
      }}
    />
  );

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderSuperhero}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No favorites yet</Text>
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
