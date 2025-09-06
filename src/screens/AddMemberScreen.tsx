import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { SuperheroCard } from "../components/SuperheroCard";
import { SearchBar } from "../components/SearchBar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Superhero } from "../types";

interface AddMemberScreenProps {
  route: {
    params: {
      teamId: string;
      teamName: string;
    };
  };
  navigation: any;
}

export const AddMemberScreen: React.FC<AddMemberScreenProps> = ({
  route,
  navigation,
}) => {
  const { teamId, teamName } = route.params;
  const { teams, removeMemberFromTeam } = useApp();

  const currentTeam = teams.find((team) => team.id === teamId);

  const handleRemoveMember = async (memberId: number, memberName: string) => {
    try {
      await removeMemberFromTeam(teamId, memberId);
      Alert.alert("Success", `${memberName} removed from team`);
    } catch (error) {
      Alert.alert("Error", "Could not remove member from team");
    }
  };

  const renderMember = ({ item }: { item: Superhero }) => (
    <View style={styles.memberContainer}>
      <SuperheroCard
        superhero={item}
        onToggleFavorite={() => {}}
        onPress={() =>
          navigation.navigate("SuperheroDetail", { superhero: item })
        }
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveMember(item.id, item.name)}
      >
        <Ionicons name="trash" size={18} color="#FFFFFF" />
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

      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{teamName}</Text>
        <Text style={styles.memberCount}>
          {currentTeam?.members.length || 0} member
          {currentTeam?.members.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={currentTeam?.members || []}
        renderItem={renderMember}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people" size={80} color="#8B5CF6" />
            <Text style={styles.emptyText}>No members in this team</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add members
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          navigation.navigate("SearchSuperhero", {
            teamId,
            teamName,
          });
        }}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32,
  },
  teamInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  memberContainer: {
    position: "relative",
    marginBottom: 8,
  },
  removeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF6B6B",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  fab: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#8B5CF6",
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#B0B0B0",
    textAlign: "center",
    lineHeight: 22,
  },
});
