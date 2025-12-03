import Icon from "@/assets/icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { styles } from "@/styles/timeline";
import { wp } from "@/utils/common";
import { getAllPosts } from "@/utils/post";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { renderPost } from "@/components/home/renderPost";

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getAllPosts();
        console.log(res.posts);
        setPosts(res.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    if (user) {
      fetchPosts();
    }
  }, [user]);

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
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Stories */}
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
          </>
        }
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
