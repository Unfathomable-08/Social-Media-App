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

export const searchUsers = async (username: string) => {
  try {
    const res = await api.get(`/${username}`);

    return res.data.users;
  }
  catch (error: any){
    console.error("Error searching users:", error);
  }
}