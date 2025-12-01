// app/create-post.tsx
import { View, Text, StyleSheet, StatusBar, Pressable, TextInput, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import ScreenWrapper from '../components/ScreenWrapper';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Icon from '../assets/icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import * as FileSystem from 'expo-file-system';

const MAX_CHARS = 500;
const IMGBB_API_KEY = process.env.EXPO_PUBLIC_IMGBB_API_KEY;

export default function CreatePost() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const user = auth?.currentUser;

  const isOverLimit = text.length > MAX_CHARS;
  const isEmpty = text.trim().length === 0;
  const isDisabled = isEmpty || isOverLimit || loading;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: false, // We don't need base64 anymore
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => setImage(null);

  const uploadImageToImgBB = async (uri: string): Promise<string> => {
    if (!IMGBB_API_KEY) {
      throw new Error('ImgBB API key is missing!');
    }

    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) throw new Error('Image file not found');

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const formData = new FormData();
    formData.append('image', base64);

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return response.data.data.url;
  };

  const handlePost = async () => {
    if (isDisabled || !user) return;

    setLoading(true);

    try {
    console.log('Posting...', { user: user.uid, text, image });
    
    let imageUrl: string | null = null;
    
    // Upload image if exists
    if (image) {
        imageUrl = await uploadImageToImgBB(image);
    }
    
    console.log('Url...', imageUrl);
    // Save post to Firestore
    await addDoc(collection(db, 'users', user.uid, 'posts'), {
        text: text.trim(),
        imageUrl: imageUrl || '',
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
    });
    
    console.log('done...');
      Alert.alert('Posted!', 'Your vibe is now live!', [
        { text: 'Cool', onPress: () => router.replace('/') },
      ]);
    } catch (error: any) {
      console.error('Error posting:', error);
      Alert.alert('Error', error.message || 'Failed to post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="#fff">
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={[styles.postButton, isDisabled && styles.postButtonDisabled]}
            onPress={handlePost}
            disabled={isDisabled}
          >
            <Text style={[styles.postButtonText, isDisabled && styles.postButtonTextDisabled]}>
              {loading ? 'Posting...' : 'Post'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.container}>
          {/* Avatar + Text Input */}
          <View style={styles.inputRow}>
            <View style={styles.avatar}>
              <Icon name="user" size={30} color={theme.colors.primary} strokeWidth={2} />
            </View>

            <TextInput
              style={[
                styles.textInput,
                isOverLimit && styles.textInputError
              ]}
              placeholder="What's on your mind?"
              placeholderTextColor="#777"
              multiline
              value={text}
              onChangeText={setText}
              textAlignVertical="top"
            />
          </View>

          {/* Attached Image Preview */}
          {image && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
              <Pressable onPress={removeImage} style={styles.removeImageBtn}>
                <Icon name="close" size={20} color="#fff" strokeWidth={3} />
              </Pressable>
            </View>
          )}

          {/* Bottom Toolbar */}
          <View style={styles.toolbar}>
            <View style={styles.leftTools}>
              <Pressable onPress={pickImage} style={styles.toolBtn}>
                <Icon name="image" size={24} color={theme.colors.primary} strokeWidth={2} />
              </Pressable>
            </View>

            <View style={styles.charCounter}>
              <Text style={[
                styles.counterText,
                text.length > 240 && { color: text.length > MAX_CHARS ? '#e0245e' : '#ffad1f' }
              ]}>
                {text.length}
              </Text>
              <Text style={styles.limitText}>/{MAX_CHARS}</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
    paddingBottom: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  cancelText: {
    fontSize: hp(2.2),
    color: theme.colors.primary,
    fontWeight: theme.fonts.semibold,
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.2),
    borderRadius: 30,
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontSize: hp(2),
    fontFamily: theme.fonts.bold,
  },
  postButtonTextDisabled: {
    color: '#999',
  },
  container: { flex: 1, paddingHorizontal: wp(5) },
  inputRow: { flexDirection: 'row', marginTop: hp(3), gap: wp(4) },
  avatar: {
    width: hp(6.5),
    height: hp(6.5),
    borderRadius: hp(3.25),
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: hp(2.6),
    color: theme.colors.text,
    paddingTop: hp(1),
    maxHeight: hp(50),
    lineHeight: hp(3.4),
  },
  textInputError: {
    backgroundColor: '#ffe6e6',
    borderRadius: theme.radius.md,
    paddingHorizontal: wp(3),
    paddingTop: hp(1),
  },
  imagePreviewContainer: {
    marginTop: hp(3),
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: { width: '100%', height: hp(60) },
  removeImageBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#eee',
    paddingVertical: hp(2),
    marginTop: 'auto',
  },
  leftTools: { flexDirection: 'row', gap: wp(6) },
  toolBtn: { padding: 8 },
  charCounter: { flexDirection: 'row', alignItems: 'center' },
  counterText: {
    fontSize: hp(2.2),
    fontFamily: theme.fonts.bold,
    color: '#777',
  },
  limitText: { fontSize: hp(2), color: '#aaa' },
});