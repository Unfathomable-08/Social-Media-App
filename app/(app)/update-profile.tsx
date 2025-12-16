import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { profileStyles } from "@/styles/accountSetting";
import { updateProfile } from "@/utils/accountSetting";
import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";


export default function UpdateProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [image, setImage] = useState<string | null>(user?.avatar || null);
  const [loading, setLoading] = useState(false);
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const handleSave = async () => {
    const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY;
    
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = user?.avatar || "";

      if (image && image !== user?.avatar) {
        const base64 = await FileSystem.readAsStringAsync(image, {
          encoding: "base64",
        });

        const formData = new FormData();
        formData.append("image", base64);

        const res = await axios.post(
          `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        imageUrl = res.data.data.url;
      }

      await updateProfile(name.trim(), imageUrl);

      Alert.alert("Success", "Profile updated!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="light-content" />
      <View style={profileStyles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={profileStyles.cancel}>Cancel</Text>
        </Pressable>
        <Pressable onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Text style={profileStyles.save}>Save</Text>
          )}
        </Pressable>
      </View>

      <View style={profileStyles.content}>
        <Pressable onPress={pickImage} style={profileStyles.avatarWrapper}>
          <Image
            source={image ? { uri: image } : require("@/assets/images/default_user.jpg")}
            style={profileStyles.avatar}
          />
          <View style={profileStyles.editIcon}>
            <Icon name="camera" size={20} color="#fff" />
          </View>
        </Pressable>

        <Text style={profileStyles.label}>Name</Text>
        <TextInput
          style={profileStyles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoFocus
        />
      </View>
    </ScreenWrapper>
  );
}