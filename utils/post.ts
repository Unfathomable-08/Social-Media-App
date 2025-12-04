import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://localhost:5000/api/posts';
const API_URL = 'https://social-media-app-backend-khaki.vercel.app/api/posts';
const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// ========== Create Post ==========
export const createPost = async (data: {
  content: string;
  image: string;
  isPublic?: boolean;
}) => {
  try {
    const res = await api.post('/', data);
    console.log('Post response:', res);
    return res.data;
  } catch (error: any) {
    console.error('Error creating post:', error);

    // Customize error message if axios error
    if (error.response) {
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      throw new Error('No response from server. Check your connection.');
    } else {
      throw new Error(error.message || 'Failed to create post');
    }
  }
};


// ========== Get All Posts (pagination) ==========
export const getFeed = async (cursor?: string, limit: number = 5) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    if (cursor) {
      params.append("cursor", cursor);
    }

    const res = await api.get(`/feed?${params.toString()}`);
    console.log(res.data)

    return {
      posts: res.data.posts || [],
      nextCursor: res.data.nextCursor || null,
      hasMore: res.data.hasMore ?? res.data.posts.length === limit,
      success: res.data.success
    };
  } catch (error: any) {
    console.error('Error fetching feed:', error);

    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to load feed');
    } else if (error.request) {
      throw new Error('No response from server. Check your internet connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};


// Helper function for initial feed load
export const getFeedInitial = (limit = 25) => getFeed(undefined, limit);