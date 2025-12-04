import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

// const API_BASE = "http://localhost:5000/api/auth";
const API_BASE = "https://social-media-app-backend-khaki.vercel.app/api/auth";
const TOKEN_KEY = "auth_token";

// Custom error class for better error handling in UI
export class AuthError extends Error {
  code: string;
  status?: number;

  constructor(message: string, code: string = "UNKNOWN_ERROR", status?: number) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.status = status;
  }
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Auto-attach JWT to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Failed to read token from storage", error);
  }
  return config;
});

// Helper: extract meaningful error message
const extractErrorMessage = (error: AxiosError<any> | any): string => {
  if (error instanceof AuthError) return error.message;

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    // Server responded with error status (4xx, 5xx)
    if (axiosError.response?.data) {
      return (
        axiosError.response.data.message ||
        axiosError.response.data.error ||
        `Server error: ${axiosError.response.status}`
      );
    }

    // Network error or no response
    if (axiosError.message === "Network Error") {
      return "No internet connection. Please check your network.";
    }

    return axiosError.message || "Request failed";
  }

  return error?.message || "An unexpected error occurred";
};

// Helper: save token
const saveToken = async (token: string) => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error("Failed to save auth token", err);
    throw new AuthError("Failed to save login session", "STORAGE_ERROR");
  }
};

// Helper: remove token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error("Failed to remove token", err);
  }
};

// User type
export interface User {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
}

// ============== SIGN UP ==============
export const signUp = async (
  email: string,
  password: string,
  username: string
): Promise<User> => {
  try {

    const res = await api.post<{ user: User; token?: string }>(
      "/signup",
      { username, email, password }
    );
    console.log(res)
    
    const token = res.data.token;
    if (token) await saveToken(token);
    
    return res.data.user;
  } catch (error: any) {
    console.log(error)
    const message = extractErrorMessage(error);
    
    // Handle specific known errors
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) throw new AuthError(message || "Invalid signup data", "VALIDATION_ERROR", status);
      if (status === 409) throw new AuthError("Email or username already exists", "ALREADY_EXISTS", status);
      throw new AuthError(message, "SIGNUP_FAILED");
    }
    throw new AuthError(message, "SIGNUP_FAILED");
  }
};

// ============== VERIFY CODE ==============
export const verifyCode = async (code: string): Promise<{ message: string }> => {
  try {
    const res = await api.post<{ message: string }>("/verify-code", { code });
    console.log(res)
    
    return res.data;
  } catch (error: any) {

    console.log(error)
    const message = extractErrorMessage(error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) throw new AuthError("Invalid or expired code", "INVALID_CODE", status);
      if (status === 410) throw new AuthError("Verification code expired", "CODE_EXPIRED", status);
    }

    throw new AuthError(message || "Failed to verify code", "VERIFICATION_FAILED");
  }
};

// ============== RESEND CODE ==============
export const resendCode = async (): Promise<{ message: string }> => {
  try {
    const res = await api.post<{ message: string }>("/resend-code");
    return res.data;
  } catch (error: any) {
    const message = extractErrorMessage(error);
    throw new AuthError(message || "Failed to resend code", "RESEND_FAILED");
  }
};

// ============== LOGIN ==============
export const signIn = async (login: string, password: string): Promise<User> => {
  try {
    const res = await api.post<{ user: User; token?: string }>("/login", {
      login,
      password,
    });
    console.log(res)

    const token = res.data.token;
    if (!token) {
      throw new AuthError("Login succeeded but no token received", "NO_TOKEN");
    }

    await saveToken(token);

    // Check verification status
    if (!res.data.user.isVerified) {
      throw new AuthError("Please verify your email before logging in", "EMAIL_NOT_VERIFIED");
    }

    return res.data.user;
  } catch (error: any) {
    
    console.log(error)
    if (error instanceof AuthError) throw error; // Re-throw known auth errors

    const message = extractErrorMessage(error);

    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new AuthError("Invalid email/username or password", "INVALID_CREDENTIALS", status);
      }
      if (status === 403) {
        throw new AuthError("Please verify your email first", "EMAIL_NOT_VERIFIED", status);
      }
      if (status === 429) {
        throw new AuthError("Too many attempts. Try again later.", "RATE_LIMITED", status);
      }
    }

    throw new AuthError(message || "Login failed", "LOGIN_FAILED");
  }
};

// ============== GET CURRENT USER ==============
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const res = await api.get<{ user: User }>("/me");

    const token = res.data?.token;
    if (token) await saveToken(token);
    
    return res.data.user;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        await removeToken();
        throw new AuthError("Session expired. Please log in again", "UNAUTHORIZED", status);
      }
    }
    // For other errors (network, etc.), don't log out, just return null
    return null;
  }
};

// ============== LOGOUT ==============
export const logOut = async () => {
  await removeToken();
};

// ============== CHECK IF LOGGED IN (on app start) ==============
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const initAuth = async (): Promise<User | null> => {
  const token = await getStoredToken();
  if (!token) return null;

  try {
    return await getCurrentUser();
  } catch (error) {
    return null; 
  }
};