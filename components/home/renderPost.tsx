import { styles } from "@/styles/timeline";
import { View, Image, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "@/assets/icons";
import { useRouter } from "expo-router";
import { theme } from "@/constants/theme";

export const renderPost = ({ item }: { item: any }) => {
  const router = useRouter();
  const hasImage = item.image && item.image.trim() !== "";

  return (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {
            item.user?.avatar ?
            <Image
              source={{
                uri: item.user?.avatar,
              }}
              style={styles.postAvatar}
            />
            :
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarCircleText}>
                { item.user?.name?.split("")[0] || item.user?.username?.split("")[0] }
              </Text>
            </View>
          }
          <View>
            <Text style={styles.postUsername}>
              {item.user?.username || "Unknown"}
            </Text>
            <Text style={styles.postTime}>{item.createdAt}</Text>
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
        {/* Caption / Text – always shown */}
        <Text style={styles.postText}>{item.content}</Text>

        {/* Image – only if it exists */}
        {hasImage && (
          <Image
            source={{ uri: item.image }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Actions */}
      <View style={styles.postActions}>
        <Pressable style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color={theme.colors.text} />
          <Text style={styles.actionCount}>{item.likesCount}</Text>
        </Pressable>

        <Pressable
          style={styles.actionButton}
          onPress={() => router.push(`/post/${item._id}`)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={22}
            color={theme.colors.text}
          />
          <Text style={styles.actionCount}>{item.commentsCount}</Text>
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Ionicons name="repeat" size={24} color={theme.colors.text} />
        </Pressable>

        <Pressable style={styles.actionButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
};
