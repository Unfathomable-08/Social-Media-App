import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { styles } from "@/styles/post";
import { hp, wp } from "@/utils/common";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";

interface NestedCommentProps {
  comment: any;
  postId: string;
  currentUserId?: string;
  depth?: number;
}

const MAX_DEPTH = 8;

export const NestedComment = ({
  comment,
  postId,
  currentUserId,
  depth = 0,
}: NestedCommentProps) => {
  const router = useRouter();
  console.log(comment)

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return days < 30 ? `${days}d` : new Date(date).toLocaleDateString();
  };

  // Visual adjustments based on depth
  const indent = depth * 20; // Enough space for line + avatar
  const avatarSize = Math.max(42 - depth * 4, 28);
  const fontScale = Math.max(1 - depth * 0.04, 0.88);
  const isReply = depth > 0;

  if (depth >= MAX_DEPTH) return null;

  return (
    <View style={{ position: "relative" }}>
      {/* Continuous Vertical Thread Line (only for replies) */}
      {isReply && (
        <View
          style={{
            position: "absolute",
            left: wp(4) + indent - 16, // Aligns with avatar center
            top: 0,
            bottom: 0,
            width: 2,
            backgroundColor: theme.colors.textLight + "30",
            borderRadius: "1px solid transparent", 
          }}
        />
      )}

      {/* Horizontal connector (small L shape) */}
      {isReply && (
        <View
          style={{
            position: "absolute",
            left: wp(4) + indent - 16,
            top: 28,
            width: 14,
            height: 2,
            backgroundColor: theme.colors.textLight + "30",
          }}
        />
      )}

      {/* Main Comment Row */}
      <View
        style={[
          styles.commentContainer,
          {
            paddingLeft: wp(4) + indent,
            paddingVertical: hp(1.8),
            paddingTop: hp(2),
            paddingBottom: hp(2.2),
          },
        ]}
      >
        {/* Avatar */}
        <Pressable onPress={() => router.push(`/`)}>
          <Image
            source={comment.user.avatar}
            placeholder={require("@/assets/images/defaultUser.png")}
            style={{
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: "#ddd",
            }}
          />
        </Pressable>

        {/* Comment Content */}
        <View style={styles.commentRight}>
          <View style={styles.commentHeader}>
            <Text
              style={[
                styles.commentName,
                { fontSize: hp(2.1) * fontScale },
              ]}
            >
              {comment.user.name || "Anonymous"}
            </Text>
            <Text style={styles.commentUsername}>
              @{comment.user.username}
            </Text>
            <Text style={styles.commentTime}>
              · {timeAgo(comment.createdAt)}
            </Text>
          </View>

          <Text
            style={[
              styles.commentText,
              {
                fontSize: hp(2.1) * fontScale,
                lineHeight: hp(3) * fontScale,
              },
            ]}
          >
            {comment.content}
          </Text>

          {/* Comment Image */}
          {comment.image && (
            <Image
              source={{ uri: comment.image }}
              style={[
                styles.commentImage,
                {
                  width: "92%",
                  alignSelf: "flex-end",
                  marginTop: hp(1.2),
                },
              ]}
              contentFit="cover"
            />
          )}

          {/* Actions */}
          <View style={styles.commentActions}>
            <Pressable style={styles.actionButton}>
              <Icon name="heart" size={18} color={theme.colors.textLight} />
              <Text style={styles.actionCount}>
                {comment.likes?.length > 0 ? comment.likes.length : ""}
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={() =>
                router.push(`/(app)/comment/${postId}_${comment._id}`)
              }
            >
              <Icon name="comment" size={18} color={theme.colors.textLight} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Render Replies Recursively */}
      {comment.replies?.map((reply: any) => (
        <NestedComment
          key={reply._id}
          comment={reply}
          postId={postId}
          currentUserId={currentUserId}
          depth={depth + 1}
        />
      ))}
    </View>
  );
};