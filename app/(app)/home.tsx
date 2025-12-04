import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { styles } from "@/styles/timeline";
import { wp } from "@/utils/common";
import { getFeed } from "@/utils/post";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
  Alert
} from "react-native";
import { renderPost } from "@/components/home/renderPost";
import { renderStory } from "@/components/home/renderStory";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async (isLoadMore = false) => {
    if (loading || (!isLoadMore && refreshing)) return;
    if (isLoadMore && !hasMore) return;

    if (isLoadMore) setLoading(true);
    else setRefreshing(true);

    try {
      const data = await getFeed(isLoadMore ? cursor : undefined);

      if (isLoadMore) {
        setPosts(prev => [...prev, ...data.posts]);
      } else {
        setPosts(data.posts);
      }

      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load more
  const onEndReached = () => {
    if (hasMore && !loading) loadFeed(true);
  };

  // Pull to refresh
  const onRefresh = () => {
    setCursor(null);
    setHasMore(true);
    loadFeed();
  };

  // Sample stories data
  const stories = [
    {
      _id: "1",
      user: "You",
      image: require("@/assets/images/defaultUser.png"),
      isYourStory: true,
    },
    {
      _id: "2",
      user: "Alex",
      image: require("@/assets/images/defaultUser.png"),
    },
    {
      _id: "3",
      user: "Emma",
      image: require("@/assets/images/defaultUser.png"),
    },
    {
      _id: "4",
      user: "John",
      image: require("@/assets/images/defaultUser.png"),
    },
    {
      _id: "5",
      user: "Sara",
      image: require("@/assets/images/defaultUser.png"),
    },
  ];

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoading && !user) {
    router.push("/welcome");
  }

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Vibely</Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Pressable>
            <Icon name="heart" size={28} color={theme.colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push("/notifications")}>
            <Icon name="send" size={28} color={theme.colors.text} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPost}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
            <View style={styles.storiesContainer}>
              <FlatList
                data={stories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                renderItem={renderStory}
                contentContainerStyle={{ paddingHorizontal: wp(4) }}
              />
            </View>
        }
        ListFooterComponent={loading && hasMore ? <ActivityIndicator style={{ margin: 20 }} /> : null}
      />

      {/* Floating Action Button */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/(app)/compose-post")}
      >
        <Icon name="plus" size={28} color="#fff" strokeWidth={2} />
      </Pressable>
    </ScreenWrapper>
  );
}
