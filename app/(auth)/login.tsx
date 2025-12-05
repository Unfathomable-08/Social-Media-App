// app/login.tsx (or wherever you have it)
import Icon from '@/assets/icons';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ScreenWrapper from '@/components/ui/ScreenWrapper';
import { theme } from '@/constants/theme';
import { signIn } from '@/utils/auth';
import { hp, wp } from '@/utils/common';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StatusBar, StyleSheet, Text, TextStyle, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    const email = emailRef.current.trim();
    const password = passwordRef.current;

    if (!email || !password) {
      Alert.alert('Login', 'Please fill in both email and password');
      return;
    }

    setLoading(true);
    
    try {
      await signIn(email, password);

      router.replace('/(app)/home'); 
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.message === 'EMAIL_NOT_VERIFIED') {
        Alert.alert(
          'Email Not Verified',
          'Please check your email and click the verification link.\n\nAlso check your Spam/Junk folder.',
          [
            {
              text: 'Resend Email',
              onPress: () => router.replace('/(auth)/check-email'),
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else if (error.code === 'auth/wrong-password') {
        Alert.alert('Login Failed', 'Incorrect password');
      } else if (error.code === 'auth/user-not-found') {
        Alert.alert('Login Failed', 'No account found with this email');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Login Failed', 'Please enter a valid email address');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Too Many Attempts', 'Account temporarily disabled. Try again later or reset password.');
      } else {
        Alert.alert('Login Failed', error.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Hey there,</Text>
          <Text style={styles.title}>Welcome Back</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            icon={<Icon name="mail" size={26} color={theme.colors.textLight} />}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={(text: string) => (emailRef.current = text)}
          />
          <Input
            icon={<Icon name="lock" size={26} color={theme.colors.textLight} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text: string) => (passwordRef.current = text)}
          />

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </Pressable>

          {/* Login Button */}
          <Button title="Login" hasShadow={true} loading={loading} onPress={onSubmit} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signUpText}>Sign Up</Text>
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
    paddingTop: hp(8),
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
    fontSize: hp(3),
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
    fontWeight: theme.fonts.medium
  } as TextStyle,
  title: {
    fontSize: hp(4),
    color: theme.colors.primary,
    fontFamily: theme.fonts.extraBold,
    fontWeight: theme.fonts.extraBold
  } as TextStyle,
  form: {
    gap: 20,
    marginTop: hp(4),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: hp(1.9),
    fontFamily: theme.fonts.semibold,
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