import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { hp, wp } from "@/utils/common";
import { useRouter } from "expo-router";
import { updateUsername } from "@/utils/accountSetting";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
  StyleSheet
} from "react-native";

export default function UpdateUsername() {
  const router = useRouter();
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);

  const isValidUsername = (str: string) => {
    return /^[a-z0-9_]{3,20}$/.test(str);
  };

  const handleSave = async () => {
    const trimmed = username.trim().toLowerCase();

    if (!trimmed) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    if (trimmed === user?.username) {
      router.back();
      return;
    }

    if (!isValidUsername(trimmed)) {
      Alert.alert(
        "Invalid Username",
        "Username must be 3-20 characters and can only contain lowercase letters, numbers, and underscores."
      );
      return;
    }

    setLoading(true);
    try {
      await updateUsername(trimmed);

      Alert.alert("Success", "Username updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error(error);
      const message =
        error.message || "Failed to update username. It might already be taken.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  const hasChanged = username.trim().toLowerCase() !== (user?.username || "");

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSave} disabled={loading || !hasChanged}>
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Text
              style={[
                styles.save,
                (!hasChanged || loading) && styles.saveDisabled,
              ]}
            >
              Save
            </Text>
          )}
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.label}>Username</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="username"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />
        </View>

        <Text style={styles.helperText}>
          Usernames can only contain lowercase letters, numbers, and underscores.
          3-20 characters.
        </Text>

        {hasChanged && username.trim() && !isValidUsername(username.trim().toLowerCase()) && (
          <Text style={styles.errorText}>
            Invalid format. Only lowercase a-z, 0-9, and _ allowed.
          </Text>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  cancel: {
    fontSize: hp(2.1),
    color: theme.colors.textLight || "#666",
  },
  save: {
    fontSize: hp(2.1),
    color: theme.colors.primary,
    fontWeight: "600",
  },
  saveDisabled: {
    color: "#aaa",
  },
  content: {
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
  },
  label: {
    fontSize: hp(2),
    color: theme.colors.textLight || "#666",
    marginBottom: hp(1),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: wp(4),
  },
  atSymbol: {
    fontSize: hp(2.8),
    color: theme.colors.textLight || "#888",
    marginRight: wp(1),
  },
  input: {
    flex: 1,
    fontSize: hp(2.8),
    paddingVertical: hp(2),
    color: theme.colors.text,
  },
  helperText: {
    fontSize: hp(1.8),
    color: theme.colors.textLight || "#888",
    marginTop: hp(2),
    lineHeight: hp(2.4),
  },
  errorText: {
    fontSize: hp(1.9),
    color: "#e0245e",
    marginTop: hp(1.5),
    fontWeight: "500",
  },
});