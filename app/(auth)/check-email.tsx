import { resendCode, verifyCode } from '@/utils/auth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Icon from '@/assets/icons';
import ScreenWrapper from '@/components/ui/ScreenWrapper';
import { theme } from '@/constants/theme';
import { hp, wp } from '@/utils/common';

const { width } = Dimensions.get('window');

export default function VerifyEmail() {
  const router = useRouter();

  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  const inputRefs = useRef<TextInput[]>([]);

  const focusNext = (index: number) => {
    if (index < 5) inputRefs.current[index + 1]?.focus();
  };

  const focusPrev = (index: number) => {
    if (index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/\D/g, '').slice(0, 1);
    if (digit || text === '') {
      const newCode = code.split('');
      newCode[index] = digit;
      setCode(newCode.join(''));
      if (digit) focusNext(index);
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      focusPrev(index);
      const newCode = code.split('');
      newCode[index - 1] = '';
      setCode(newCode.join(''));
    }
  };

  const handlePaste = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 6);
    setCode(digits.padEnd(6, ''));
    setTimeout(() => {
      const last = digits.length < 6 ? digits.length : 5;
      inputRefs.current[last]?.focus();
    }, 10);
    Keyboard.dismiss();
  };

  const isComplete = code.length === 6;

  const onVerify = async () => {
    if (!isComplete) {
      const firstEmpty = code.split('').findIndex(c => !c);
      setShakeIndex(firstEmpty === -1 ? 0 : firstEmpty);
      setTimeout(() => setShakeIndex(null), 600);
      Alert.alert('Incomplete Code', 'Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      await verifyCode(code);
      Alert.alert('Success!', 'Email verified successfully!', [
        { text: 'Continue', onPress: () => router.replace('/(app)/home') },
      ]);
    } catch (error: any) {
      let message = 'Invalid or expired code.';
      if (error.response?.status === 400) message = 'Invalid code. Please try again.';
      if (error.response?.status === 410) message = 'Code expired. Request a new one.';
      Alert.alert('Verification Failed', message);

      setCode('');
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResendLoading(true);
    try {
      await resendCode();
      setCodeSent(true);
      setTimeout(() => setCodeSent(false), 4000);
      setCode('');
      inputRefs.current[0]?.focus();
      Alert.alert('Code Sent', 'A new code has been sent to your email.');
    } catch (error: any) {
      const msg = error.response?.status === 429
        ? 'Too many requests. Please wait a minute.'
        : 'Failed to resend code.';
      Alert.alert('Error', msg);
    } finally {
      setResendLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => inputRefs.current[0]?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <ScreenWrapper bg="white">
      <StatusBar barStyle="dark-content" />

      {/* Back button – untouched */}
      <Pressable onPress={() => router.back()} style={styles.backButton} disabled={loading}>
        <Icon name="arrowLeft" size={26} color={theme.colors.text} strokeWidth={2.5} />
      </Pressable>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit code to your email address
          </Text>
          <Text style={styles.hint}>Check Spam folder if not received</Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {Array.from({ length: 6 }, (_, i) => {
            const filled = !!code[i];
            const isShaking = shakeIndex === i;

            return (
              <View
                key={i}
                style={[
                  styles.digitBox,
                  filled && styles.digitBoxFilled,
                  !filled && !isComplete && styles.digitBoxEmpty,
                  isShaking && styles.shake,
                ]}
              >
                <TextInput
                  ref={ref => ref && (inputRefs.current[i] = ref)}
                  style={styles.digitText}
                  value={code[i] || ''}
                  onChangeText={t => handleChange(t, i)}
                  onKeyPress={e => handleKeyPress(e, i)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  selectTextOnFocus
                  editable={!loading}
                  autoCapitalize="none"
                  onPaste={e => {
                    e.preventDefault();
                    handlePaste(e.nativeEvent.text);
                  }}
                />
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            onPress={onVerify}
            disabled={!isComplete || loading}
            style={({ pressed }) => [
              styles.verifyBtn,
              pressed && styles.verifyBtnPressed,
            ]}
          >
            <Text style={styles.verifyText}>
              {resendLoading ? 'Verifying...' : 'Verify Code'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onResend}
            disabled={resendLoading}
            style={({ pressed }) => [
              styles.resendBtn,
              pressed && styles.resendBtnPressed,
            ]}
          >
            <Ionicons name="refresh-outline" size={22} color={theme.colors.primary} />
            <Text style={styles.resendText}>
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </Text>
          </Pressable>

          {codeSent && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
              <Text style={styles.successText}>New code sent!</Text>
            </View>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

/* ========== STYLES ========== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
    paddingTop: hp(6),
    justifyContent: 'space-between',
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  title: {
    fontSize: hp(4.2),
    fontWeight: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp(2.8),
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: hp(2),
    lineHeight: hp(3),
  },
  hint: {
    fontSize: hp(2.4),
    color: theme.colors.text,
    marginTop: hp(2),
    fontWeight: theme.fonts.medium
  },

  // OTP Boxes
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    gap: wp(2),
  },
  digitBox: {
    width: wp(14),
    height: wp(14),
    borderRadius: theme.radius.xs,
    borderWidth: 1.4,
    borderColor: theme.colors.text,
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitBoxFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  digitBoxEmpty: {
    borderColor: theme.colors.text,
  },
  digitText: {
    fontSize: hp(4),
    fontFamily: theme.fonts.bold,
    color: theme.colors.text,
    minWidth: 30,
    textAlign: 'center',
  },

  // Shake animation (using transform)
  shake: {
    borderColor: theme.colors.rose,
    borderWidth: 2.5,
    animationName: 'shake',
  },

  // Actions
  actions: {
    marginTop: hp(6),
    alignItems: 'center',
    width: '100%'
  },
  resendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.radius.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '40',
    marginTop: hp(2),
    width: '100%'
  },
  resendBtnPressed: {
    backgroundColor: theme.colors.primary + '10',
  },
  resendText: {
    fontSize: hp(2.1),
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },

  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.primary,
    marginTop: hp(2),
    width: '100%'
  },
  verifyBtnPressed: {
    backgroundColor: theme.colors.primary + '10',
  },
  verifyText: {
    fontSize: hp(2.4),
    color: "#ffffff",
    fontWeight: theme.fonts.medium,
  },
  
  // Success banner
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: hp(3),
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primary + '15',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
  },
  successText: {
    color: theme.colors.primary,
    fontSize: hp(2),
    fontFamily: theme.fonts.medium,
  },

  // Back button (unchanged as requested)
  backButton: {
    alignSelf: 'flex-start',
    padding: 4,
    borderRadius: theme.radius.xxl,
    backgroundColor: 'rgba(0,0,0,0.07)',
    marginLeft: hp(2),
  },
});