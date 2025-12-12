import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
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
  ActivityIndicator,
  Alert,
} from "react-native";
import { styles } from "@/styles/inbox";
import { Ionicons } from "@expo/vector-icons";
import { searchUsers } from "@/utils/search";

interface Message {
  id: string;
  user: string;
  avatar: any;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
}

interface SearchUser {
  id: string;
  username: string;
  avatar?: string; // assuming the API returns avatar URL or you have a default
}

export default function Inbox() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Mock messages data (your conversations)
  const messages: Message[] = [
    {
      id: "1",
      user: "Emma Wilson",
      avatar: require("@/assets/images/defaultUser.png"),
      lastMessage: "Haha that’s hilarious 😂",
      timestamp: "2m ago",
      unread: 3,
      isOnline: true,
    },
    // ... other mock messages
  ];

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

  const renderMessageItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() =>
        router.push('/')
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

  const renderSearchUser = ({ item }: { item: SearchUser }) => (
    <TouchableOpacity
      style={styles.searchUserItem}
      onPress={() => {
        if (!user?.username || !item.username) return;

        const sortedUsernames = [user.username, item.username].sort();
        const chatPath = sortedUsernames.join("_");

        router.push(`/(app)/inbox/${chatPath}`);
      }}
    >
      <Image
        source={
          item.avatar
            ? { uri: item.avatar }
            : require("@/assets/images/defaultUser.png")
        }
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
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />

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
            <ActivityIndicator size="small" color="#888" style={{ marginRight: 8 }} />
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
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) =>
          isSearching ? renderSearchUser({ item }) : renderMessageItem({ item })
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: hp(1) }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="comment" size={80} color="#ddd" />
            <Text style={styles.emptyText}>
              {isSearching
                ? "No users found"
                : "No messages yet"}
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
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/(app)/inbox")}
      >
        <Icon name="edit" size={28} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </ScreenWrapper>
  );
}