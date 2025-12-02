import { View, Text, StyleSheet, StatusBar, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Button from '../components/Button';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../assets/icons';
import { signUp } from '@/utils/auth';

export default function Signup() {
  const router = useRouter();

  const nameRef = useRef<string>('');
  const emailRef = useRef<string>('');
  const passwordRef = useRef<string>('');

  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const name = nameRef.current.trim();
    const email = emailRef.current.trim();
    const password = passwordRef.current;

    // Validation
    if (!name || !email || !password) {
      Alert.alert('Sign Up', 'Please fill all the fields!');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Sign Up', 'Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name);

      console.log("success!")

      Alert.alert(
        'Success!',
        'Account created! Please check your email and click the verification link to activate your account.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/check-email'), 
          },
        ]
      );

    } catch (error: any) {
      console.error('Signup error:', error);

      let message = 'Something went wrong. Please try again.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Try logging in.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.message) {
        message = error.message;
      }

      Alert.alert('Sign Up Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar barStyle="dark-content" />

      {/* Back Button */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrowLeft" size={26} color={theme.colors.text} strokeWidth={2.5} />
      </Pressable>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.title}>Get Started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Field */}
          <Input
            icon={<Icon name="user" size={26} color={theme.colors.textLight} />}
            placeholder="Create a username"
            onChangeText={(text) => (nameRef.current = text)}
          />

          {/* Email Field */}
          <Input
            icon={<Icon name="mail" size={26} color={theme.colors.textLight} />}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => (emailRef.current = text)}
          />

          {/* Password Field */}
          <Input
            icon={<Icon name="lock" size={26} color={theme.colors.textLight} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => (passwordRef.current = text)}
          />

          {/* Signup Button */}
          <Button
            title="Signup"
            hasShadow={true}
            style={{ marginTop: 20 }}
            loading={loading}
            onPress={onSubmit}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={[styles.footerText, styles.signUpText]}>Login</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
    paddingBottom: hp(5),
    gap: 20,
  },
  backBtn: {
   alignSelf: 'flex-start',
   marginLeft: 4,
   padding: 4,
   borderRadius: theme.radius.xxl,
   backgroundColor: 'rgba(0,0,0,0.07)',
  },
  header: {
    gap: 6,
  },
  welcomeText: {
    fontSize: hp(4),
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontWeight: theme.fonts.bold,
  },
  title: {
    fontSize: hp(4),
    color: theme.colors.primary,
    fontFamily: theme.fonts.extraBold,
    fontWeight: theme.fonts.extraBold
  },
  form: {
    gap: 20,
    marginTop: hp(4),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  footerText: {
    color: theme.colors.text,
    fontSize: hp(2),
    fontFamily: theme.fonts.medium,
  },
  signUpText: {
    color: theme.colors.primary,
    fontSize: hp(2),
    fontFamily: theme.fonts.bold,
  },
});