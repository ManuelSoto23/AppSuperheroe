import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Superhero } from "../types";
import { SearchBar } from "./SearchBar";
import { SuperheroSelectionCard } from "./SuperheroSelectionCard";
import { colors, spacing, typography, borderRadius } from "../theme";

interface SuperheroSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMembers: (superheroes: Superhero[]) => void;
  availableSuperheroes: Superhero[];
  teamName: string;
}

export const SuperheroSelectionModal: React.FC<
  SuperheroSelectionModalProps
> = ({ visible, onClose, onAddMembers, availableSuperheroes, teamName }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSuperheroes, setSelectedSuperheroes] = useState<Set<number>>(
    new Set()
  );

  const filteredSuperheroes = useMemo(() => {
    if (!searchQuery.trim()) return availableSuperheroes;

    return availableSuperheroes.filter(
      (hero) =>
        hero.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hero.realName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableSuperheroes, searchQuery]);

  const handleToggleSelection = (superheroId: number) => {
    const newSelection = new Set(selectedSuperheroes);
    if (newSelection.has(superheroId)) {
      newSelection.delete(superheroId);
    } else {
      newSelection.add(superheroId);
    }
    setSelectedSuperheroes(newSelection);
  };

  const handleAddMembers = () => {
    const selectedHeroes = availableSuperheroes.filter((hero) =>
      selectedSuperheroes.has(hero.id)
    );
    onAddMembers(selectedHeroes);
    setSelectedSuperheroes(new Set());
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSelectedSuperheroes(new Set());
    setSearchQuery("");
    onClose();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const renderSuperhero = ({ item }: { item: Superhero }) => {
    const isSelected = selectedSuperheroes.has(item.id);

    return (
      <SuperheroSelectionCard
        superhero={item}
        isSelected={isSelected}
        onToggleSelection={handleToggleSelection}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <Text style={styles.title}>Add Member</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.teamName}>to {teamName}</Text>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar"
              onClear={handleClearSearch}
            />
          </View>

          <FlatList
            data={filteredSuperheroes}
            renderItem={renderSuperhero}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={colors.textMuted}
                />
                <Text style={styles.emptyText}>
                  No se encontraron superhéroes
                </Text>
              </View>
            }
          />

          {selectedSuperheroes.size > 0 && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddMembers}
              >
                <Text style={styles.addButtonText}>
                  Agregar {selectedSuperheroes.size} miembro
                  {selectedSuperheroes.size !== 1 ? "s" : ""}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xs,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
  },
  teamName: {
    fontSize: typography.md,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxxxl,
  },
  emptyText: {
    fontSize: typography.md,
    color: colors.textMuted,
    marginTop: spacing.lg,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.card,
  },
  addButton: {
    backgroundColor: colors.violet,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.text,
  },
});
