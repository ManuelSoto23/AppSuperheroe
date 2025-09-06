import { StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "./index";

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  title: {
    fontSize: typography.xxxl,
    fontWeight: typography.bold,
    color: colors.text,
  },

  subtitle: {
    fontSize: typography.xxl,
    fontWeight: typography.semibold,
    color: colors.text,
  },

  body: {
    fontSize: typography.md,
    fontWeight: typography.normal,
    color: colors.text,
  },

  caption: {
    fontSize: typography.sm,
    fontWeight: typography.normal,
    color: colors.textSecondary,
  },
});
