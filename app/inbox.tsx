// app/dm.tsx  → Pure Realtime Database (NOT Firestore)
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import { auth } from "@/lib/firebase";
import { rtdb } from "@/lib/firebase";
import { ref, onValue, push, set, serverTimestamp } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";
import { onAuthStateChanged } from "firebase/auth";

// Fixed convo path — both users see the same chat
const CONVO_PATH = "chats/m8374527_muhammad124711";

export default function DirectChat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(auth?.currentUser || null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthLoading(false);
      setCurrentUser(user);
      console.log(auth?.currentUser);
    });

    return unsub;
  }, []);

  const otherUserName =
    currentUser?.email === "m8374527@gmail.com" ? "Muhammad" : "MD";

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Only allow the two test accounts
    if (
      !["m8374527@gmail.com", "muhammad124711@gmail.com"].includes(
        currentUser.email!
      )
    ) {
      setLoading(false);
      return;
    }

    const messagesRef = ref(rtdb, CONVO_PATH);

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

      setLoading(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => unsubscribe();
  }, [currentUser]); // ← FIXED

  const sendMessage = () => {
    if (!newMessage.trim() || !currentUser) return;

    const text = newMessage.trim();
    setNewMessage("");

    const messagesRef = ref(rtdb, CONVO_PATH);
    const newMsgRef = push(messagesRef);

    set(newMsgRef, {
      text,
      userId: currentUser.uid,
      userEmail: currentUser.email,
      createdAt: Date.now(), // ← best for Realtime DB
    });
  };

  if (authLoading) {
    return (
      <ScreenWrapper bg="#fff">
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 100 }}
        />
      </ScreenWrapper>
    );
  }

  if (!currentUser) {
    return (
      <ScreenWrapper>
        <Text style={{ textAlign: "center", marginTop: 50 }}>
          Log in as m8374527@gmail.com or muhammad124711@gmail.com
        </Text>
      </ScreenWrapper>
    );
  }

  if (loading) {
    return (
      <ScreenWrapper bg="#fff">
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{ marginTop: 100 }}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper bg="#fff">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={{ fontSize: 20 }}>{otherUserName[0]}</Text>
        </View>
        <Text style={styles.username}>{otherUserName}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
                item.userEmail === currentUser.email
                  ? styles.myBubble
                  : styles.theirBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.userEmail === currentUser.email && { color: "white" },
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={{ padding: wp(4), paddingBottom: hp(10) }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor="#999"
            multiline
            onSubmitEditing={sendMessage}
          />
          <Pressable onPress={sendMessage} style={styles.sendBtn}>
            <Ionicons name="send" size={24} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  avatarPlaceholder: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },
  username: {
    fontSize: hp(2.6),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  bubble: {
    maxWidth: "80%",
    padding: wp(4),
    borderRadius: 20,
    marginVertical: hp(0.8),
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  messageText: {
    fontSize: hp(2),
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: wp(4),
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
    marginRight: wp(3),
    fontSize: hp(2),
    maxHeight: hp(15),
  },
  sendBtn: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
