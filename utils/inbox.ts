import axois from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://social-media-app-backend-khaki.vercel.app/api/inbox";
const TOKEN_KEY = "auth_token"

const api = axois.create({
  baseURL: API_URL,
})

// Add token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getChatsMetadata = async () => {
  try {
    const res = await api.get(`/chats`);
    console.log(res.data.chats)

    return res.data.chats;
  }
  catch (error: any){
    console.error("Error getting chats:", error);

    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to load feed');
    } else if (error.request) {
      throw new Error('No response from server. Check your internet connection.');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
}