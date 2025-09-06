import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Team } from "../types";
import {
  colors,
  typography,
  spacing,
  commonStyles,
  borderRadius,
} from "../theme";

interface TeamsScreenProps {
  navigation: any;
}

export const TeamsScreen: React.FC<TeamsScreenProps> = ({ navigation }) => {
  const { teams, loading, createTeam, deleteTeam } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teamName, setTeamName] = useState("");

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      Alert.alert("Error", "Please enter a team name");
      return;
    }

    try {
      await createTeam(teamName.trim());
      setTeamName("");
      setShowCreateModal(false);
      Alert.alert("Success", "Team created successfully");
    } catch (error) {
      Alert.alert("Error", "Could not create team");
    }
  };

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    Alert.alert(
      "Delete Team",
      `Are you sure you want to delete the team "${teamName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTeam(teamId);
              Alert.alert("Success", "Team deleted successfully");
            } catch (error) {
              Alert.alert("Error", "Could not delete team");
            }
          },
        },
      ]
    );
  };

  const renderTeam = ({ item }: { item: Team }) => (
    <View style={styles.teamCard}>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{item.name}</Text>
        <Text style={styles.memberCount}>
          {item.members.length} member{item.members.length !== 1 ? "s" : ""}
        </Text>
      </View>
      <View style={styles.teamActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            navigation.navigate("AddMember", {
              teamId: item.id,
              teamName: item.name,
            });
          }}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTeam(item.id, item.name)}
        >
          <Ionicons name="trash" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <LoadingSpinner message="Loading teams..." />;
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Teams</Text>
      </View>

      <FlatList
        data={teams}
        renderItem={renderTeam}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color={colors.text} />
            <Text style={styles.emptyText}>Create your first team</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to create a new superhero team
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateModal(true)}
      >
        <Ionicons name="add" size={24} color={colors.text} />
      </TouchableOpacity>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Team</Text>

            <Text style={styles.inputLabel}>Team name:</Text>
            <TextInput
              style={styles.textInput}
              value={teamName}
              onChangeText={setTeamName}
              placeholder="Ex: The Avengers"
              placeholderTextColor={colors.textSecondary}
              autoFocus
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateTeam}
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
  fab: {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.lg,
    backgroundColor: colors.secondary,
    borderRadius: 28,
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
    shadowRadius: borderRadius.sm,
    elevation: 8,
  },
  teamCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.xs,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: 4,
  },
  memberCount: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
  teamActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    marginRight: spacing.md,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxl,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.modal,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    margin: spacing.xl,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.text,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  inputLabel: {
    fontSize: typography.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.md,
    color: colors.text,
    marginBottom: spacing.xxl,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.textMuted,
    borderRadius: 8,
    paddingVertical: spacing.md,
    marginRight: spacing.sm,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
  createButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
    alignItems: "center",
  },
  createButtonText: {
    color: colors.text,
    fontSize: typography.md,
    fontWeight: typography.semibold,
  },
});
