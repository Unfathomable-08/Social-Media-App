import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://social-media-app-backend-khaki.vercel.app/api/account";
const TOKEN_KEY = "auth_token";

const api = axios.create({
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

// ========== Update username  ==========
export const updateUsername = async (username: string) => {
  try {
    const res = await api.put("/update", { username });

    return res.data;
  } catch (error: any) {
    console.error("Error updating username:", error);

    if (error.response){
      throw new Error(error.response.data.message || "Failed to update username");
    } else if (error.request){
      throw new Error("No response from server. Check your internet connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}

// ========== Update name + avatar  ==========
export const updateProfile = async (name: string, avatar: string) => {
  try {
    const res = await api.put("/update", { name, avatar });

    return res.data;
  } catch (error: any) {
    console.error("Error updating profile:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Failed to update profile");
    } else if (error.request) {
      throw new Error("No response from server. Check your internet connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}