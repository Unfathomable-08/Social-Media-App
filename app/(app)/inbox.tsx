import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { useAuth } from "@/contexts/authContext";
import { styles } from "@/styles/inbox";
import { hp } from "@/utils/common";
import { getChatsMetadata } from "@/utils/inbox";
import { searchUsers } from "@/utils/search";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatUser {
  _id: string;
  username: string;
  avatar?: string; 
  isOnline?: boolean;
}

interface Message {
  _id: string;
  slug: string;
  users: ChatUser[];
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
}

interface MessageItemProps {
  item: Message;
  currentUserId: string; 
}

export default function Inbox() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getChatsMetadata();
      setMessages(res);
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const results = await searchUsers(searchQuery.trim());
      // Assuming searchUsers now returns the data properly
      setSearchResults(results || []);
    } catch (err) {
      Alert.alert("Error", "Failed to search users. Please try again.");
      console.error(err);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    setSearchResults([]);
  };

const renderMessageItem = ({ item, currentUserId }: MessageItemProps) => {
  const router = useRouter();

  // Find the OTHER user (not the current user)
  const otherUser = item.users.find(user => user._id !== currentUserId);

  // Fallback if something goes wrong 
  const displayUser = otherUser || item.users[0];

  const username = displayUser.username || 'Unknown';
  const avatarSource = {uri: displayUser.avatar}

  const isOnline = displayUser.isOnline ?? false;
  const unreadCount = item.unread || 0;

  return (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => router.push(`/inbox/${item.slug}`)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Image contentFit="cover" source={avatarSource} style={styles.avatar} placeholder={require("@/assets/images/default_user.jpg")} />
        {isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.username}>{username}</Text>
          {item.timestamp && (
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          )}
        </View>
        {item.lastMessage && (
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

  const renderSearchUser = ({ item }: { item: ChatUser }) => (
    <TouchableOpacity
      style={styles.searchUserItem}
      onPress={() => {
        if (!user?.username || !item.username) return;

        const sortedUsernames = [user.id, item._id].sort();
        const chatPath = sortedUsernames.join("_");

        router.push(`/(app)/inbox/${chatPath}`);
      }}
    >
      <Image
        source={{ uri: item.avatar }}
        placeholder={require("@/assets/images/default_user.jpg")}
        contentFit="cover"
        style={styles.avatar}
      />
      <Text style={styles.searchUsername}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="dark-content" />

      {/* Header with Search Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>

        <View style={styles.searchContainer}>
          <Icon
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search users"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch} // search on Enter
            autoCorrect={false}
          />

          {loading && (
            <ActivityIndicator
              size="small"
              color="#888"
              style={{ marginRight: 8 }}
            />
          )}

          {searchQuery.length > 0 && !loading && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-outline" size={18} color="#888" />
            </Pressable>
          )}

          {/* Search Button */}
          <Pressable onPress={handleSearch} style={styles.searchButton2}>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={isSearching ? searchResults : messages}
        keyExtractor={(item: any) => item._id}
        renderItem={({ item }) =>
          isSearching ? renderSearchUser({ item }) : renderMessageItem({ item, currentUserId: user?.id || "" })
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: hp(1) }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="comment" size={80} color="#ddd" />
            <Text style={styles.emptyText}>
              {isSearching ? "No users found" : "No messages yet"}
            </Text>
            <Text style={styles.emptySubtext}>
              {isSearching
                ? `No results for "${searchQuery}"`
                : "Start a conversation!"}
            </Text>
          </View>
        }
      />

      {/* Floating New Message Button */}
      <Pressable style={styles.fab} onPress={() => router.push("/(app)/inbox")}>
        <Icon name="edit" size={28} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </ScreenWrapper>
  );
}
