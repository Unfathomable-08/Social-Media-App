import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { hp, wp } from "@/utils/common";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { addComment } from "@/utils/postActions";
import { styles } from "@/styles/composePost";
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

const MAX_CHARS = 380;
const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY;

export default function WriteComment() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const isOverLimit = text.length > MAX_CHARS;
    const isEmpty = text.trim().length === 0;
    const isDisabled = isEmpty || isOverLimit || loading;

    const handlePost = async () => {
        if (isDisabled) return;
        
        setLoading(true);

        try {
            
            await addComment(
                Array.isArray(id) ? id[0] : id, //typescript err
                text.trim(),
            );
            
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
            <StatusBar barStyle="light-content" />
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
                    </ScrollView>

                    {/* Bottom Toolbar pinned */}
                    <View style={styles.toolbar}>
                        <Pressable disabled style={styles.iconBtn}>
                            <Icon
                                name="image"
                                size={28}
                                color={theme.colors.primary + "77"}
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