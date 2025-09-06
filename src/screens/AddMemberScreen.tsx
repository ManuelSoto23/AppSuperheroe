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
import { SuperheroSelectionModal } from "../components/SuperheroSelectionModal";
import { Superhero } from "../types";
import {
  colors,
  spacing,
  typography,
  borderRadius,
  commonStyles,
} from "../theme";

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
  const {
    teams,
    removeMemberFromTeam,
    addMemberToTeam,
    addMultipleMembersToTeam,
    superheroes,
    addToFavorites,
    removeFromFavorites,
  } = useApp();
  const [showSelectionModal, setShowSelectionModal] = useState(false);

  const currentTeam = teams.find((team) => team.id === teamId);

  const handleRemoveMember = async (memberId: number, memberName: string) => {
    try {
      await removeMemberFromTeam(teamId, memberId);
      Alert.alert("Success", `${memberName} removed from team`);
    } catch (error) {
      Alert.alert("Error", "Could not remove member from team");
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
      Alert.alert("Error", "Could not update favorite status");
    }
  };

  const handleAddMembers = async (selectedSuperheroes: Superhero[]) => {
    try {
      await addMultipleMembersToTeam(teamId, selectedSuperheroes);
      Alert.alert(
        "Success",
        `${selectedSuperheroes.length} member(s) added to team`
      );
    } catch (error) {
      Alert.alert("Error", "Could not add members to team");
    }
  };

  const availableSuperheroes = superheroes.filter(
    (hero) => !currentTeam?.members.some((member) => member.id === hero.id)
  );

  const renderMember = ({ item }: { item: Superhero }) => {
    const fullSuperhero =
      superheroes.find((hero) => hero.id === item.id) || item;

    return (
      <View style={styles.memberContainer}>
        <SuperheroCard
          superhero={fullSuperhero}
          onToggleFavorite={handleToggleFavorite}
          onPress={() =>
            navigation.navigate("SuperheroDetail", { superhero: fullSuperhero })
          }
        />
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveMember(item.id, item.name)}
        >
          <Ionicons name="trash" size={18} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
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
            <Ionicons name="people-outline" size={80} color={colors.violet} />
            <Text style={styles.emptyText}>No members in this team</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add members
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowSelectionModal(true)}
      >
        <Ionicons name="add" size={24} color={colors.text} />
      </TouchableOpacity>

      <SuperheroSelectionModal
        visible={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onAddMembers={handleAddMembers}
        availableSuperheroes={availableSuperheroes}
        teamName={teamName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  backButton: {
    padding: spacing.xs,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  teamInfo: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  teamName: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  memberCount: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  memberContainer: {
    position: "relative",
    marginBottom: spacing.sm,
  },
  removeButton: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.error,
    borderRadius: borderRadius.xxxl,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: colors.text,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xxxxl,
    right: spacing.xl,
    backgroundColor: colors.violet,
    borderRadius: borderRadius.xxxl,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
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
    paddingVertical: spacing.xxxxl,
    paddingHorizontal: spacing.xxxl,
    minHeight: 200,
  },
  emptyText: {
    fontSize: typography.lg,
    color: colors.text,
    textAlign: "center",
    fontWeight: typography.semibold,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
});
