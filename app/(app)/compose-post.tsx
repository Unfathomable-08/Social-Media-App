import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { hp, wp } from "@/utils/common";
import { createPost } from "@/utils/post";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "@/styles/composePost";
import { Image } from "expo-image";

const MAX_CHARS = 380;

export default function CreatePost() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  const isOverLimit = text.length > MAX_CHARS;
  const isEmpty = text.trim().length === 0;
  const isDisabled = isEmpty || isOverLimit || loading;
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };
  
  const removeImage = () => setImage(null);
  
  const handlePost = async () => {
    const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY;
    
    if (isDisabled) return;

    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const base64 = await FileSystem.readAsStringAsync(image, {
          encoding: "base64",
        });

        const formDataImg = new FormData();
        formDataImg.append("image", base64);

        const uploadUrl = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

        const uploadResponse = await axios.post(uploadUrl, formDataImg, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = uploadResponse.data.data.url;
      }

      await createPost({
        content: text.trim(),
        image: imageUrl,
        isPublic: true,
      });

      Alert.alert("Success", "Your post is live!", [
        { text: "Done", onPress: () => router.replace("/(app)/home") },
      ]);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Axios Error Full Object:", error);
        console.error("Request config:", error.config);
        console.error("Request sent:", error.request);
        console.error("Response from server:", error.response); 
      } else {
        console.error("Non-Axios error:", error);
      }
      Alert.alert(
        "Error",
        axios.isAxiosError(error)
          ? error.response?.data?.error || error.message
          : error.message || "Failed to post. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.replace("/(app)/home")} hitSlop={10}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.postButton, isDisabled && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={isDisabled}
          >
            {loading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Text
                style={[
                  styles.postButtonText,
                  isDisabled && styles.postButtonTextDisabled,
                ]}
              >
                Post
              </Text>
            )}
          </Pressable>
        </View>

        {/* Main content */}
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              paddingHorizontal: wp(5),
              paddingTop: hp(3),
              paddingBottom: hp(3),
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* User Row */}
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Icon
                  name="user"
                  size={26}
                  color={theme.colors.primary}
                  strokeWidth={1.8}
                />
              </View>
              <Text style={styles.username}>{user?.username || "You"}</Text>
            </View>

            {/* Text Input */}
            <TextInput
              style={[styles.textInput, isOverLimit && styles.textInputError]}
              placeholder="What's on your mind?"
              placeholderTextColor="#888"
              multiline
              value={text}
              onChangeText={setText}
              textAlignVertical="top"
              autoFocus
            />

            {/* Image Preview */}
            {image && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
                <Pressable onPress={removeImage} style={styles.removeBtn}>
                  <Ionicons
                    name="close"
                    size={20}
                    color="#fff"
                    strokeWidth={3}
                  />
                </Pressable>
              </View>
            )}
          </ScrollView>

          {/* Bottom Toolbar pinned */}
          <View style={styles.toolbar}>
            <Pressable onPress={pickImage} style={styles.iconBtn}>
              <Icon
                name="image"
                size={28}
                color={theme.colors.primary}
                strokeWidth={1.5}
              />
            </Pressable>

            <View style={styles.charCounter}>
              <Text
                style={[
                  styles.count,
                  {
                    color:
                      text.length > 300
                        ? "#e0245e"
                        : text.length > 200
                        ? "#ffad1f"
                        : "#666",
                  },
                ]}
              >
                {text.length}
              </Text>
              <Text style={styles.slash}>/</Text>
              <Text style={styles.max}>{MAX_CHARS}</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
