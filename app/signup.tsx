// app/login.tsx (or wherever you have it)
import { View, Text, StyleSheet, StatusBar, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { theme } from '../constants/theme';
import { hp, wp } from '../helpers/common';
import Button from '../components/Button';
import Input from '../components/Input';
import ScreenWrapper from '../components/ScreenWrapper';
import Icon from '../assets/icons';
import { supabase } from '../lib/supabase';

export default function Signup() {
  const router = useRouter();
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    // Add your login logic here
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert('Sign Up', 'Please fill all the fields!');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailRef.current,
      password: passwordRef.current,
    })

    if (error){
      Alert.alert('Sign Up', error.message);
    }

    console.log('data: ', data);
    
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
          <Text style={styles.welcomeText}>Let's</Text>
          <Text style={styles.title}>Get Started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>

          <Input
            icon={<Icon name="user" size={26} color={theme.colors.textLight} />}
            placeholder="Enter your name"
            onChangeText={(text) => (emailRef.current = text)}
          />
            
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

          {/* Signup Button */}
          <Button title="Signup" hasShadow={true} style={{ marginTop: 20 }} loading={loading} onPress={onSubmit} />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text style={styles.signUpText}>Login</Text>
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