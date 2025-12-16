import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { styles } from "@/styles/timeline";
import { User } from "@/utils/auth";
import { timeAgo } from "@/utils/common";
import { likePost } from "@/utils/postActions";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export const RenderPost = ({
  item,
  user,
  setPosts,
}: {
  item: any;
  user: User | null;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const router = useRouter();
  const hasImage = item.image && item.image.trim() !== "";

  const postLikeFn = (id: any) => {
    try {
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== id) return p;
          
          const alreadyLiked = p.likes.includes(user?.id);
          
          return {
            ...p,
            likes: alreadyLiked
            ? p.likes.filter((l: string) => l !== user?.id)
              : [...p.likes, user?.id],
            likesCount: alreadyLiked ? p.likesCount - 1 : p.likesCount + 1,
          };
        })
      );
      
      likePost(id);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.postContainer}
      onPress={() => router.push(`/(app)/post/${item._id}`)}
    >
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Image
            source={{
              uri: item.user?.avatar,
            }}
            style={styles.postAvatar}
            placeholder={require("@/assets/images/default_user.jpg")}
          />
          <View>
            <Text style={styles.postUsername}>
              {item.user?.username || "Unknown"}
            </Text>
            <Text style={styles.postTime}>{timeAgo(item.createdAt)} ago</Text>
          </View>
        </View>

        <Pressable hitSlop={10}>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={theme.colors.text}
          />
        </Pressable>
      </View>

      {/* Body (Text + Optional Image) */}
      <View style={styles.postBody}>
        {/* Text */}
        <Text style={styles.postText}>{item.content}</Text>

        {/* Image – only if it exists */}
        {hasImage && (
          <Image
            source={{ uri: item.image }}
            style={styles.postImage}
            contentFit="cover"
          />
        )}
      </View>

      {/* Actions */}
      <View style={styles.postActions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => postLikeFn(item._id)}
        >
          {item.likes.includes(user?.id) ? (
            <Ionicons name="heart" size={24} color={theme.colors.primary} />
          ) : (
            <Ionicons
              name="heart-outline"
              size={24}
              color={theme.colors.text}
            />
          )}
          <Text style={styles.actionCount}>{item.likesCount}</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push(`/(app)/comment/${item._id}`)}
        >
          <Icon
            name="comment"
            size={22}
            color={theme.colors.text}
          />
          <Text style={styles.actionCount}>{item.commentsCount}</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Icon name="send" size={24} color={theme.colors.text} />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};
