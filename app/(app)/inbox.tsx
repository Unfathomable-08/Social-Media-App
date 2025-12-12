import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { wp, hp } from "@/utils/common";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { styles } from "@/styles/inbox";
import { Ionicons } from "@expo/vector-icons";

export default function Inbox() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock messages data
  const messages = [
    {
      id: "1",
      user: "Emma Wilson",
      avatar: require("@/assets/images/defaultUser.png"),
      lastMessage: "Haha that’s hilarious 😂",
      timestamp: "2m ago",
      unread: 3,
      isOnline: true,
    },
    {
      id: "2",
      user: "Alex Chen",
      avatar: require("@/assets/images/defaultUser.png"),
      lastMessage: "Are we still on for tomorrow?",
      timestamp: "15m ago",
      unread: 0,
      isOnline: true,
    },
    {
      id: "3",
      user: "Sarah Kim",
      avatar: require("@/assets/images/defaultUser.png"),
      lastMessage: "Sent you a photo",
      timestamp: "1h ago",
      unread: 1,
      isOnline: false,
    },
    {
      id: "4",
      user: "John Doe",
      avatar: require("@/assets/images/defaultUser.png"),
      lastMessage: "Thanks for the help!",
      timestamp: "3h ago",
      unread: 0,
      isOnline: false,
    },
    {
      id: "5",
      user: "Maya Patel",
      avatar: require("@/assets/images/defaultUser.png"),
      lastMessage: "Voice message (0:12)",
      timestamp: "Yesterday",
      unread: 5,
      isOnline: true,
    },
  ];

  // Filter messages based on search
  const filteredMessages = messages.filter((msg) =>
    msg.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessageItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() =>
        router.push({
          pathname: "/(app)/chat",
          params: { userId: item.id, username: item.user },
        })
      }
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.username}>{item.user}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>
            {item.unread > 9 ? "9+" : item.unread}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="dark-content" />

      {/* Header with Search Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>

        {/* Instagram-style Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} style={styles.clearButton}>
              <Ionicons name="close-outline" size={18} color="#888" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessageItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: hp(1) }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="comment" size={80} color="#ddd" />
            <Text style={styles.emptyText}>
              {searchQuery ? "No results found" : "No messages yet"}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? `Try searching for "${searchQuery}"` : "Start a conversation!"}
            </Text>
          </View>
        }
      />

      {/* Floating New Message Button */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/(app)/new-message")}
      >
        <Icon name="edit" size={28} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </ScreenWrapper>
  );
}