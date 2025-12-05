import { Stack, Redirect } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import { ActivityIndicator, View } from "react-native";
import { theme } from "@/constants/theme";

export default function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="compose-post" />
      {/* <Stack.Screen name="inbox" /> */}
    </Stack>
  );
}