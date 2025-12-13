import { rtdb } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { onValue, push, ref, set } from "firebase/database";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import { searchUserByID } from "@/utils/search";
import { styles } from "@/styles/chat";
import { theme } from "@/constants/theme";
import { wp, hp } from "@/utils/common";
import { timeAgo } from "@/utils/common";

export default function DirectChat() {
  const { username } = useLocalSearchParams();
  const { user } = useAuth();
  const [otherUser, setOtherUser] = useState({
    username: "",
    name: "",
    avatar: "",
  });
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!username) return;

    const fetchData = async () => {
      const usernameStr = Array.isArray(username) ? username[0] : username;
      const parts = usernameStr.split("_");
      const other = parts[0] != user?.username ? parts[0] : parts[1];
      const results = await searchUserByID(other);
      if (results) setOtherUser(results);
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    if (!user || !rtdb) return;

    const messagesRef = ref(rtdb, `chats/${username}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        loadedMessages.sort((a, b) => a.createdAt - b.createdAt);
        setMessages(loadedMessages);
      } else {
        setMessages([]);
      }

      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    });

    return () => unsubscribe();
  }, [username, user]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user || !rtdb) return;

    const text = newMessage.trim();
    setNewMessage("");

    const messagesRef = ref(rtdb, `chats/${username}`);
    const newMsgRef = push(messagesRef);

    set(newMsgRef, {
      text,
      userId: user.id,
      userEmail: user.email,
      createdAt: Date.now(),
    });
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMine = item.userEmail === user?.email;

    return (
      <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.theirMessage]}>
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
          <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
            {item.text}
          </Text>
        </View>
        <View style={{flexDirection: 'row-reverse', gap: 6}}>
          {isMine && (
            <Ionicons
              name="checkmark-outline"
              size={16}
              color="rgba(0,0,0,0.8)"
              style={styles.deliveredIcon}
            />
          )}
          <Text style={styles.timestamp}>
            {timeAgo(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper bg="#fff">
      {/* Enhanced Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
        </Pressable>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {otherUser?.username?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
          {/* Online indicator (can be made dynamic later) */}
          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.username}>
          {otherUser?.name || otherUser?.username || "Loading..."}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: wp(4), paddingBottom: hp(2) }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="center"
            onSubmitEditing={sendMessage}
          />
          <Pressable
            onPress={sendMessage}
            disabled={!newMessage.trim()}
            style={[styles.sendBtn, !newMessage.trim() && styles.sendBtnDisabled]}
          >
            <Ionicons name="send" size={24} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}