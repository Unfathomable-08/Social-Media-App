import { styles } from "@/styles/timeline";
import { Text, View, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";

export const renderStory = ({ item }: any) => (
  <Pressable style={styles.storyItem}>
    <View style={[styles.storyRing, item.isYourStory && styles.yourStoryRing]}>
      <Image source={item.image} style={styles.storyImage} />
      {item.isYourStory && (
        <View style={styles.plusIcon}>
          <Ionicons name="add-circle" size={20} color={theme.colors.primary} />
        </View>
      )}
    </View>
    <Text style={styles.storyName} numberOfLines={1}>
      {item.isYourStory ? "Your Story" : item.user}
    </Text>
  </Pressable>
);
