import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Superhero } from "../types";
import { useApp } from "../context/AppContext";
import { SuperheroCard } from "../components/SuperheroCard";
import { SearchBar } from "../components/SearchBar";

interface SearchSuperheroScreenProps {
  route: {
    params: {
      teamId: string;
      teamName: string;
    };
  };
  navigation: any;
}

export const SearchSuperheroScreen: React.FC<SearchSuperheroScreenProps> = ({
  route,
  navigation,
}) => {
  const { teamId, teamName } = route.params;
  const { superheroes, addMemberToTeam, teams } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const currentTeam = teams.find((team) => team.id === teamId);
  const currentMemberIds =
    currentTeam?.members.map((member) => member.id) || [];

  const availableSuperheroes = useMemo(() => {
    return superheroes.filter((hero) => !currentMemberIds.includes(hero.id));
  }, [superheroes, currentMemberIds]);

  const filteredSuperheroes = useMemo(() => {
    if (!searchQuery.trim()) {
      return availableSuperheroes;
    }

    const query = searchQuery.toLowerCase();
    return availableSuperheroes.filter(
      (hero) =>
        hero.name.toLowerCase().includes(query) ||
        hero.biography.fullName.toLowerCase().includes(query) ||
        hero.biography.aliases.some((alias) =>
          alias.toLowerCase().includes(query)
        )
    );
  }, [availableSuperheroes, searchQuery]);

  const handleAddMember = async (superhero: Superhero) => {
    try {
      await addMemberToTeam(teamId, superhero);
      Alert.alert("Success", `${superhero.name} added to team ${teamName}`);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Could not add member to team");
    }
  };

  const renderSuperhero = ({ item }: { item: Superhero }) => (
    <View style={styles.superheroContainer}>
      <SuperheroCard
        superhero={item}
        onToggleFavorite={() => {}}
        onPress={() =>
          navigation.navigate("SuperheroDetail", { superhero: item })
        }
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddMember(item)}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Member</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchSection}>
        <Text style={styles.teamName}>{teamName}</Text>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
        />
      </View>

      <FlatList
        data={filteredSuperheroes}
        renderItem={renderSuperhero}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No superheroes found"
                : "No superheroes available to add"}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0B2E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  flatList: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  superheroContainer: {
    position: "relative",
    marginBottom: 8,
  },
  addButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#8B5CF6",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
  },
});
