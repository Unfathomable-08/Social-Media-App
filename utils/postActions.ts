import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "http://localhost:5000/api/actions/posts";
const API_URL = "https://social-media-app-backend-khaki.vercel.app/api/actions/posts";
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


// ========== Like Post ==========
export const likePost = async (postId: string) => {
  try {
    const res = await api.post(`/${postId}/like`);
    console.log(res.data)
    
    return res.data;
  } catch (error: any) {
    console.error("Error liking post:", error);

    if (error.response){
      throw new Error(error.response.data.message || "Failed to like post");
    } else if (error.request) {
      throw new Error("No response from server. Check your internet connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}

// ========== Load Comment ==========
export const loadComments = async (postId: string) => {
  try {
    const res = await api.get(`/${postId}/comments`);
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error("Error loading comments:", error);

    if (error.response){
      throw new Error(error.response.data.message || "Failed to load comments");
    } else if (error.request){
      throw new Error("No response from server. Check your internet connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}

// ========== Add Comment ==========
export const addComment = async (postId: string, content: string) => {
  try {
    const res = await api.post(`/${postId}/comment`, { content });
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error("Error adding comment:", error);

    if (error.response) {
      throw new Error(error.response.data.message || "Failed to add comment");
    } else if (error.request) {
      throw new Error("No response from server. Check your internet connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}

// ========== Delete Comment ==========
export const deleteComment = async (postId: string, commentId: string) => {
  try {
    const res = await api.delete(`/${postId}/comments/${commentId}`);
    console.log(res.data)

    return res.data;
  } catch (error: any) {
    console.error("Error deleting comment:", error);

    if (error.response){
      throw new Error(error.response.data.message || "Failed to delete comment");
    } else if (error.request){
      throw new Error("No response from server. Check your internet connection.");
    } else {
      throw new Error(error.message || "An unexpected error occurred");
    }
  }
}
