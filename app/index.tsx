// app/index.tsx
import { View, Text, StyleSheet, StatusBar, FlatList, Image, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import Icon from '../assets/icons';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace('/welcome');
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sample stories data
  const stories = [
    { id: '1', user: 'You', image: require('../assets/images/defaultUser.png'), isYourStory: true },
    { id: '2', user: 'Alex', image: require('../assets/images/defaultUser.png') },
    { id: '3', user: 'Emma', image: require('../assets/images/defaultUser.png') },
    { id: '4', user: 'John', image: require('../assets/images/defaultUser.png') },
    { id: '5', user: 'Sara', image: require('../assets/images/defaultUser.png') },
  ];

  // Sample posts
  const posts = [
    {
      id: '1',
      username: 'alex_travel',
      avatar: require('../assets/images/defaultUser.png'),
      image: require('../assets/images/defaultUser.png'),
      likes: 234,
      caption: 'Chasing sunsets in Bali',
      timeAgo: '2h',
    },
    {
      id: '2',
      username: 'jessica.art',
      avatar: require('../assets/images/defaultUser.png'),
      image: require('../assets/images/defaultUser.png'),
      likes: 892,
      caption: 'New painting finished! What do you think? 🎨',
      timeAgo: '5h',
    },
  ];

  const renderStory = ({ item }: any) => (
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
        {item.isYourStory ? 'Your Story' : item.user}
      </Text>
    </Pressable>
  );

  const renderPost = ({ item }: any) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Image source={item.avatar} style={styles.postAvatar} />
          <View>
            <Text style={styles.postUsername}>{item.username}</Text>
            <Text style={styles.postTime}>{item.timeAgo}</Text>
          </View>
        </View>
        <Pressable>
          <Icon name="threeDotsHorizontal" size={24} color={theme.colors.text} />
        </Pressable>
      </View>

      {/* Post Image */}
      <Image source={item.image} style={styles.postImage} resizeMode="cover" />

      {/* Actions */}
      <View style={styles.postActions}>
        <Pressable>
          <Icon name="heart" size={28} color={theme.colors.text} strokeWidth={2} />
        </Pressable>
        <Pressable onPress={() => router.push(`/post/${item.id}`)}>
          <Icon name="comment" size={26} color={theme.colors.text} strokeWidth={2} />
        </Pressable>
        <Pressable>
          <Icon name="send" size={26} color={theme.colors.text} strokeWidth={2} />
        </Pressable>
      </View>

      {/* Likes & Caption */}
      <View style={styles.postFooter}>
        <Text style={styles.likesText}>{item.likes} likes</Text>
        <Text style={styles.caption}>
          <Text style={{ fontFamily: theme.fonts.bold }}>{item.username}</Text>{' '}
          {item.caption}
        </Text>
      </View>
    </View>
  );

  if (!user) return null; // or loading spinner

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Vibely</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <Pressable>
            <Icon name="heart" size={28} color={theme.colors.text} />
          </Pressable>
          <Pressable onPress={() => router.push('/notifications')}>
            <Icon name="send" size={28} color={theme.colors.text} />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
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
                keyExtractor={(item) => item.id}
                renderItem={renderStory}
                contentContainerStyle={{ paddingHorizontal: wp(4) }}
              />
            </View>
          </>
        }
      />

      {/* Floating Action Button */}
      <Pressable style={styles.fab} onPress={() => router.push('/compose-post')}>
        <Icon name="plus" size={28} color="#fff" strokeWidth={2} />
      </Pressable>
    </ScreenWrapper>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
  },
  logo: {
    fontSize: hp(4),
    fontWeight: theme.fonts.extraBold,
    color: theme.colors.primary,
  },
  storiesContainer: {
    paddingVertical: hp(2),
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  storyItem: {
    alignItems: 'center',
    marginRight: wp(4),
  },
  storyRing: {
    width: hp(8.5),
    height: hp(8.5),
    borderRadius: hp(4.25),
    padding: 3,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  yourStoryRing: {
    borderColor: '#ccc',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: hp(4),
    borderWidth: 2,
    borderColor: '#fff',
  },
  plusIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  storyName: {
    marginTop: 6,
    fontSize: hp(1.5),
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  postContainer: {
    backgroundColor: '#fff',
    marginBottom: hp(3),
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
  },
  postAvatar: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(2.75),
  },
  postUsername: {
    fontFamily: theme.fonts.bold,
    fontSize: hp(2),
    color: theme.colors.text,
  },
  postTime: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
  },
  postImage: {
    width: '100%',
    height: hp(50),
  },
  postActions: {
    flexDirection: 'row',
    gap: 20,
    padding: wp(4),
  },
  postFooter: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  likesText: {
    fontFamily: theme.fonts.bold,
    fontSize: hp(1.9),
    color: theme.colors.text,
  },
  caption: {
    marginTop: 6,
    fontSize: hp(1.9),
    color: theme.colors.text,
    lineHeight: hp(2.6),
  },
  fab: {
    position: 'absolute',
    bottom: hp(6),
    right: wp(6),
    backgroundColor: theme.colors.primary,
    width: hp(7),
    height: hp(7),
    borderRadius: hp(3.5),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});