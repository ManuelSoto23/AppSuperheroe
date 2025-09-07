import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../theme";

interface PowerStatItemProps {
  label: string;
  value: number;
  maxValue?: number;
}

export const PowerStatItem: React.FC<PowerStatItemProps> = ({
  label,
  value,
  maxValue = 100,
}) => {
  const percentage = (value / maxValue) * 100;
  const getColor = (val: number) => {
    if (val >= 80) return colors.success;
    if (val >= 50) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.powerStatItem}>
      <Text style={styles.powerStatLabel}>{label}</Text>
      <View style={styles.powerStatBar}>
        <View
          style={[
            styles.powerStatFill,
            {
              width: `${percentage}%`,
              backgroundColor: getColor(value),
            },
          ]}
        />
      </View>
      <Text style={styles.powerStatValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  powerStatItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  powerStatLabel: {
    fontSize: typography.sm,
    color: "#FFFFFF",
    flex: 1,
    fontWeight: "600",
  },
  powerStatBar: {
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: borderRadius.xs,
    flex: 2,
    marginHorizontal: spacing.sm,
  },
  powerStatFill: {
    height: "100%",
    borderRadius: borderRadius.xs,
  },
  powerStatValue: {
    fontSize: typography.sm,
    color: colors.text,
    textAlign: "right",
    minWidth: 25,
  },
});
