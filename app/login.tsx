// app/login.tsx (or wherever you have it)
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Button from '../components/Button';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../assets/icons';

export default function Login() {
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // Add your login logic here
    if (!emailRef.current || !passwordRef.current) {
      alert('Please fill all fields');
      return;
    }
    setLoading(true);
    // ...your auth logic
    setLoading(false);
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
          <Text style={styles.welcomeText}>Hey there,</Text>
          <Text style={styles.title}>Welcome Back</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            icon={<Icon name="mail" size={26} color={theme.colors.textLight} />}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={(text) => (emailRef.current = text)}
          />
          <Input
            icon={<Icon name="lock" size={26} color={theme.colors.textLight} />}
            placeholder="Enter your password"
            secureTextEntry
            onChangeText={(text) => (passwordRef.current = text)}
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
          <Pressable onPress={() => router.push('/signup')}>
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