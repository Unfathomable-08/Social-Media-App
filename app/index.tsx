import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";
import ScreenWrapper from "../components/ScreenWrapper"

export default function Index() {
  const router = useRouter();
  
  return (
    <ScreenWrapper bg="#ffffff" >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Hello World!</Text>
        <Button title="Welcome!" onPress={() => router.push('welcome')} />
      </View>
    </ScreenWrapper>
  );
}
