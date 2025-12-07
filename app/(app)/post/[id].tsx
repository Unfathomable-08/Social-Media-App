import Icon from "@/assets/icons";
import { Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "@/components/ui/ScreenWrapper";
import { RenderComment } from "@/components/home/renderComment";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { getPost } from "@/utils/post";
import { loadComments } from "@/utils/postActions";
import { hp, wp } from "@/utils/common";
import { likePost } from "@/utils/postActions";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  Alert,
} from "react-native";
import { styles } from "@/styles/post";
import { timeAgo } from "@/utils/common";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const postData = await getPost(id);
      const commentsData = await loadComments(id)
      setPost(postData.post);
      setComments(commentsData.comments)
    } catch (error: any) {
      Alert.alert("Error", error.message);
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const likePostFn = (id: any) => {
    try {
      setPost((p: any) => {
        const alreadyLiked = p.likes.includes(user?.id);

        return {
          ...p,
          likes: alreadyLiked
            ? p.likes.filter((l: string) => l !== user?.id)
            : [...p.likes, user?.id],
          likesCount: alreadyLiked ? p.likesCount - 1 : p.likesCount + 1,
        };
      });

      likePost(id);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper bg="#fff">
      {/* Header */}
      <View style={styles.postHeader}>
        <Pressable onPress={() => router.replace('/(app)/home')} style={styles.backButton}>
          <Icon name="arrowLeft" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={comments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <RenderComment item={item} currentUserId={user?.id} />
        )}
        ListHeaderComponent={
          <View style={{ paddingBottom: hp(2) }}>
            {/* Main Post */}
            <View>
              <View style={styles.postHeader}>
                <Pressable
                  onPress={() => router.push(`/`)}
                >
                  <Image
                    source={
                      post.user.image
                        ? { uri: post.user.image }
                        : require("@/assets/images/defaultUser.png")
                    }
                    style={styles.postAvatar}
                  />
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Pressable
                    onPress={() => router.push(`/`)}
                  >
                    <Text style={styles.postName}>{post?.user?.name}</Text>
                  </Pressable>
                  {post.user?.name && (
                    <Text style={styles.postname}>
                      {post?.user?.name?.toLowerCase() || "Muhammad"}
                    </Text>
                  )}
                  <Text style={styles.postUsername}>
                    @{post.user?.username?.toLowerCase()}
                  </Text>
                </View>
                <Text style={styles.postTime}>{timeAgo(post.createdAt)}</Text>
              </View>

              <Text style={styles.postText}>{post?.content}</Text>

              {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
              )}

              <View style={styles.postActions}>
                <Pressable onPress={() => router.push(`/(app)/comment/${post._id}`)} style={styles.actionButton}>
                  <Icon
                    name="comment"
                    size={22}
                    color={theme.colors.textLight}
                  />
                  <Text style={styles.actionCount}>
                    {post.commentsCount || 0}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => likePostFn(post._id)}
                >
                  {post.likes.includes(user?.id) ? (
                    <Ionicons
                      name="heart"
                      size={22}
                      color={theme.colors.primary}
                    />
                  ) : (
                    <Ionicons
                      name="heart-outline"
                      size={22}
                      color={theme.colors.text}
                    />
                  )}
                  <Text style={styles.actionCount}>{post.likesCount}</Text>
                </Pressable>
                <Pressable>
                  <Icon name="send" size={22} color={theme.colors.text} />
                </Pressable>
              </View>
            </View>

            {/* Replies Title */}
            {comments?.length > 0 && (
              <Text style={styles.repliesTitle}>Replies</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.noComments}>No replies yet. Be the first!</Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(12) }}
      />

      {/* Reply FAB */}
      <Pressable
        style={styles.replyFab}
        onPress={() =>
          router.push({
            pathname: "/(app)/compose-post",
            params: { replyTo: id, replyToUser: post.user.name },
          })
        }
      >
        <Icon name="comment" size={28} color="#fff" />
      </Pressable>
    </ScreenWrapper>
  );
}
