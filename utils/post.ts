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
export const getAllPosts = async ( page: number = 1, limit: number = 20 ) => {
  try {
    const res = await api.get(`/?page=${page}&limit=${limit}`);
    
    return res.data;
  }
  catch (error: any) {
    console.error('Error fetching posts:', error);

    // Customize error message if axios error
    if (error.response){
      throw new Error(error.response.data.message || 'Server error occurred');
    } else if (error.request) {
      throw new Error('No response from server. Check your connection.');
    } else {
      throw new Error(error.message || 'Failed to fetch posts');
    }
  }
}