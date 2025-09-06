import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius } from "../theme";

interface CreateTeamModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateTeam: (teamName: string) => Promise<void>;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  visible,
  onClose,
  onCreateTeam,
}) => {
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!teamName.trim()) return;

    setIsLoading(true);
    try {
      await onCreateTeam(teamName.trim());
      setTeamName("");
      onClose();
    } catch (error) {
      console.error("Error creating team:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTeamName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Create new team</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.label}>Team name</Text>
              <TextInput
                style={styles.input}
                value={teamName}
                onChangeText={setTeamName}
                placeholder="Enter team name"
                placeholderTextColor={colors.textMuted}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleCreate}
                editable={!isLoading}
              />
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  (!teamName.trim() || isLoading) &&
                    styles.createButtonDisabled,
                ]}
                onPress={handleCreate}
                disabled={!teamName.trim() || isLoading}
              >
                <Text style={styles.createButtonText}>
                  {isLoading ? "Creating..." : "Create"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    minHeight: 220,
  },
  modal: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.xxxl,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.md,
    fontWeight: typography.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.text,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.md,
    color: colors.background,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 44,
  },
  footer: {
    paddingTop: spacing.sm,
  },
  createButton: {
    backgroundColor: colors.violet,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  createButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.text,
  },
});
