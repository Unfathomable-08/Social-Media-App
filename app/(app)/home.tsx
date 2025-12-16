import Icon from "@/assets/icons";
import { RenderPost } from "@/components/home/renderPost";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { styles } from "@/styles/timeline";
import { loadFeed } from "@/utils/feed";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load more
  const onEndReached = () => {
    if (hasMore && !loading)
      loadFeed({
        isLoadMore: true,
        loading,
        setLoading,
        refreshing,
        setRefreshing,
        hasMore,
        setHasMore,
        cursor,
        setCursor,
        setPosts,
      });
  };

  // Pull to refresh
  const onRefresh = () => {
    setCursor(null);
    setHasMore(true);
    loadFeed({
      isLoadMore: true,
      loading,
      setLoading,
      refreshing,
      setRefreshing,
      hasMore,
      setHasMore,
      cursor,
      setCursor,
      setPosts,
    });
  };

  // Sample stories data
  const stories = [
    {
      _id: "1",
      user: "You",
      image: require("@/assets/images/default_user.jpg"),
      isYourStory: true,
    },
    {
      _id: "2",
      user: "Alex",
      image: require("@/assets/images/default_user.jpg"),
    },
    {
      _id: "3",
      user: "Emma",
      image: require("@/assets/images/default_user.jpg"),
    },
    {
      _id: "4",
      user: "John",
      image: require("@/assets/images/default_user.jpg"),
    },
    {
      _id: "5",
      user: "Sara",
      image: require("@/assets/images/default_user.jpg"),
    },
  ];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isLoading && !user) {
    router.push("/welcome");
  }

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Awaza</Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Pressable onPress={() => router.push("/(app)/account-setting")}>
            <Icon name="user" size={28} color={theme.colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push("/(app)/inbox")}>
            <Icon name="send" size={28} color={theme.colors.text} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RenderPost item={item} user={user} setPosts={setPosts} />
        )}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.feedTopSection}>
            <View style={styles.chipsContainer}>
              <Pressable style={[styles.chip, styles.chipActive]}>
                <Text style={styles.chipTextActive}>All Posts</Text>
              </Pressable>
              <Pressable style={styles.chip}>
                <Text style={styles.chipText}>Following</Text>
              </Pressable>
              <Pressable style={styles.chip}>
                <Text style={styles.chipText}>Trending</Text>
              </Pressable>
            </View>
          </View>
        }
        // ListHeaderComponent={
        //     <View style={styles.storiesContainer}>
        //       <FlatList
        //         data={stories}
        //         horizontal
        //         showsHorizontalScrollIndicator={false}
        //         keyExtractor={(item) => item._id}
        //         renderItem={renderStory}
        //         contentContainerStyle={{ paddingHorizontal: wp(4) }}
        //       />
        //     </View>
        // }
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator
              style={{ margin: 20 }}
              color={theme.colors.primary}
            />
          ) : null
        }
      />

      {/* Floating Action Button */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/(app)/compose-post")}
      >
        <Icon name="edit" size={28} color="#fff" strokeWidth={2} />
      </Pressable>
    </ScreenWrapper>
  );
}
