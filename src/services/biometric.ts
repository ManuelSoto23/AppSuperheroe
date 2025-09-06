import * as LocalAuthentication from "expo-local-authentication";
import { BiometricAuthenticationError, BiometricAuthResult } from "../types";

class BiometricService {
  async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  }

  async authenticate(): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isAvailable();

      if (!isAvailable) {
        return {
          success: false,
          error: {
            code: "NOT_AVAILABLE",
            message: "Biometric authentication is not available on this device",
          },
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authentication required",
        cancelLabel: "Cancel",
        fallbackLabel: "Use password",
        disableDeviceFallback: false,
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: {
            code: result.error || "AUTHENTICATION_FAILED",
            message: this.getErrorMessage(result.error),
          },
        };
      }
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: "An unexpected error occurred during authentication",
        },
      };
    }
  }

  private getErrorMessage(errorCode?: string): string {
    switch (errorCode) {
      case "UserCancel":
        return "Authentication cancelled by user";
      case "UserFallback":
        return "User chose to use alternative method";
      case "SystemCancel":
        return "Authentication cancelled by system";
      case "NotAvailable":
        return "Biometric authentication not available";
      case "NotEnrolled":
        return "No biometric data registered";
      case "Lockout":
        return "Too many failed attempts. Try again later";
      case "LockoutPermanent":
        return "Biometric authentication permanently locked";
      default:
        return "Unknown authentication error";
    }
  }
}

export const biometricService = new BiometricService();
