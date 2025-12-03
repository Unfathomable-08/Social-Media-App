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
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const MAX_CHARS = 380;
const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY;

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
      console.error(error);
      Alert.alert("Error", error.message || "Failed to post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/(app)/home')} hitSlop={10}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.postButton, isDisabled && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={isDisabled}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
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
              <Text style={styles.username}>{ user?.username || "You" }</Text>
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
                  resizeMode="cover"
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
              <Text style={styles.iconLabel}>Photo</Text>
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

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(2),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  cancelText: {
    fontSize: hp(2.2),
    color: theme.colors.primary,
    fontWeight: "600",
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1),
    borderRadius: 30,
    minWidth: wp(22),
    alignItems: "center",
  },
  postButtonDisabled: {
    backgroundColor: "#ccc",
  },
  postButtonText: {
    color: "#fff",
    fontSize: hp(2.1),
    fontWeight: "700",
  },
  postButtonTextDisabled: {
    color: "#888",
  },

  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2.5),
    gap: wp(3),
  },
  avatar: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(4),
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#eee",
  },
  username: {
    fontSize: hp(2.4),
    fontWeight: "bold",
    color: theme.colors.text,
  },

  textInput: {
    fontSize: hp(2.4),
    color: theme.colors.text,
    lineHeight: hp(3.8),
    paddingHorizontal: wp(1),
    minHeight: hp(20),
    paddingTop: hp(1),
  },
  textInputError: {
    backgroundColor: "#ffebee",
    borderRadius: theme.radius.lg,
    paddingHorizontal: wp(3),
  },

  imageContainer: {
    marginTop: hp(3),
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    position: "relative",
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  previewImage: {
    width: wp(90),
    aspectRatio: "4/3",
  },
  removeBtn: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(3),
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginTop: "auto",
    marginBottom: hp(10),
    paddingHorizontal: wp(5)
  },
  iconBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  iconLabel: {
    fontSize: hp(2.1),
    color: theme.colors.primary,
    fontWeight: "600",
  },
  charCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 20,
  },
  count: {
    fontSize: hp(2.2),
    fontWeight: "bold",
  },
  slash: {
    fontSize: hp(2),
    color: "#aaa",
    marginHorizontal: wp(1),
  },
  max: {
    fontSize: hp(2),
    color: "#aaa",
  },
});
