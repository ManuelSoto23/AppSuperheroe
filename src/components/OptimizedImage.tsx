import React from "react";
import { Image, ImageProps, StyleSheet } from "react-native";
import { Superhero } from "../types";

interface OptimizedImageProps extends Omit<ImageProps, "source"> {
  superhero: Superhero;
  size: "xs" | "sm" | "md" | "lg";
  style?: any;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  superhero,
  size,
  style,
  ...props
}) => {
  const getImageUri = () => {
    switch (size) {
      case "xs":
        return superhero.images.xs;
      case "sm":
        return superhero.images.sm;
      case "md":
        return superhero.images.md;
      case "lg":
        return superhero.images.lg;
      default:
        return superhero.images.md;
    }
  };

  const getFallbackUri = () => {
    if (size === "lg") return superhero.images.md;
    if (size === "md") return superhero.images.sm;
    return superhero.images.xs;
  };

  return (
    <Image
      source={{ uri: getImageUri() }}
      style={[styles.image, style]}
      resizeMode="cover"
      defaultSource={{ uri: getFallbackUri() }}
      fadeDuration={200}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});
