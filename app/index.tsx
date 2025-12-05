import { Redirect } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import { ActivityIndicator, View } from "react-native";
import { theme } from "@/constants/theme";

export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <Redirect href={user ? "/(app)/home" : "/welcome"} />;
}