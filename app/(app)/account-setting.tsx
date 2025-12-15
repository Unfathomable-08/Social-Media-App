import Icon from "@/assets/icons";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { styles } from "@/styles/accountSetting";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Image } from 'expo-image';

export default function AccountSettings() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const avatarSource = user?.avatar
    ? { uri: user.avatar }
    : require("@/assets/images/defaultUser.png");

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Icon name="arrowLeft" size={26} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.title}>Account Settings</Text>
        <View style={{ width: 26 }} /> {/* Spacer */}
      </View>

      <View style={styles.container}>
        {/* Current Avatar & Name */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={avatarSource} 
              style={styles.avatar} 
              placeholder={require("@/assets/images/defaultUser.png")}
            />
          </View>
          <Text style={styles.displayName}>{user?.name || "Your Name"}</Text>
          <Text style={styles.username}>@{user?.username || "username"}</Text>
        </View>

        {/* Update Name & Avatar Button */}
        <Pressable
          style={styles.optionButton}
          onPress={() => router.push("/(app)/update-profile")}
        >
          <View style={styles.optionLeft}>
            <Icon name="user" size={24} color={theme.colors.text} />
            <Text style={styles.optionText}>Edit Name & Avatar</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#888" />
        </Pressable>

        {/* Update Username Button */}
        <Pressable
          style={styles.optionButton}
          onPress={() => router.push("/(app)/update-username")}
        >
          <View style={styles.optionLeft}>
            <Ionicons name="at" size={24} color={theme.colors.text} />
            <Text style={styles.optionText}>Change Username</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#888" />
        </Pressable>
      </View>
    </ScreenWrapper>
  );
}