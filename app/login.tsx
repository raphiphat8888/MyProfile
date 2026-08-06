import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Header } from '@/components/common/Header';
import { AppColors, AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';

type Mode = 'login' | 'register';

const profileTrainerImage = require('@/assets/images/profile-trainer-master.png');

export default function LoginScreen() {
  const router = useRouter();
  const auth = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@pokemon-takt.shop');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('Enter your trainer name.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = mode === 'register'
        ? await auth.register(name, email, password)
        : await auth.login(email, password);

      router.replace(user.role === 'admin' ? '/admin' : '/');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (auth.user) {
    return (
      <SafeAreaView style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
        <Header title="Account" searchPlaceholder="Search account..." actionLabel="Shop" actionHref="/" />
        <View style={styles.center}>
          <View style={styles.accountCard}>
            <View style={styles.avatar}><Image source={profileTrainerImage} style={styles.avatarImage} contentFit="cover" /></View>
            <Text style={styles.accountKicker}>{auth.isAdmin ? 'STAFF SESSION' : 'TRAINER SESSION'}</Text>
            <Text style={styles.accountTitle}>{auth.user.name}</Text>
            <Text style={styles.accountEmail}>{auth.user.email}</Text>
            <View style={styles.accountActions}>
              <Pressable onPress={() => router.replace(auth.isAdmin ? '/admin' : '/')} style={styles.primaryButton}>
                <Text style={styles.primaryText}>{auth.isAdmin ? 'Open Admin' : 'Back to Shop'}</Text>
              </Pressable>
              <Pressable onPress={auth.logout} style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>Log out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Login" searchPlaceholder="Search account..." actionLabel="Admin" actionHref="/admin" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="account-circle-outline" size={26} color={AppColors.primary} />
          </View>
          <Text style={styles.title}>Trainer Login</Text>
          <Text style={styles.subtitle}>User accounts are for checkout and saved orders. Admin tools stay in the staff console.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.segment}>
            <Pressable onPress={() => { setMode('login'); setError(''); }} style={[styles.segmentButton, mode === 'login' && styles.segmentActive]}>
              <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>Login</Text>
            </Pressable>
            <Pressable onPress={() => { setMode('register'); setError(''); }} style={[styles.segmentButton, mode === 'register' && styles.segmentActive]}>
              <Text style={[styles.segmentText, mode === 'register' && styles.segmentTextActive]}>Register</Text>
            </Pressable>
          </View>

          <View style={styles.passport}>
            <View style={styles.avatar}><Image source={profileTrainerImage} style={styles.avatarImage} contentFit="cover" /></View>
            <View>
              <Text style={styles.passportTitle}>{mode === 'register' ? 'New Trainer' : 'Customer Account'}</Text>
              <Text style={styles.passportId}>ID: {email.trim() || 'user@pokemon-takt.shop'}</Text>
            </View>
          </View>

          {mode === 'register' ? (
            <>
              <Text style={styles.fieldLabel}>TRAINER NAME</Text>
              <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Takt Trainer" placeholderTextColor={AppColors.subtleText} />
            </>
          ) : null}

          <Text style={styles.fieldLabel}>EMAIL OR TRAINER ID</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="user@pokemon-takt.shop"
            placeholderTextColor={AppColors.subtleText}
          />

          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder={mode === 'login' ? 'User@1234' : 'Create a password'}
            placeholderTextColor={AppColors.subtleText}
          />

          <View style={styles.rememberRow}>
            <Pressable onPress={() => setRemember((value) => !value)} style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember ? <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" /> : null}
            </Pressable>
            <Text style={styles.rememberText}>Remember Me</Text>
            <Pressable onPress={() => router.push('/admin')}>
              <Text style={styles.adminLink}>Admin login</Text>
            </Pressable>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={AppColors.secondary} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <Pressable disabled={loading} onPress={() => void handleSubmit()} style={({ pressed }) => [styles.primaryButton, styles.submit, pressed && styles.pressed]}>
            {loading ? <ActivityIndicator color={AppColors.primary} /> : <Text style={styles.primaryText}>{mode === 'register' ? 'Create User Account' : 'Login as User'}</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  content: { alignItems: 'center', padding: 24, paddingBottom: 54 },
  center: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 },
  hero: { alignItems: 'center', marginTop: 26, maxWidth: 620 },
  badge: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  title: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 44, marginTop: 14, textAlign: 'center' },
  subtitle: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 16, lineHeight: 24, marginTop: 8, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 30, borderWidth: 1, marginTop: 28, maxWidth: 560, padding: 28, shadowColor: '#24325A', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.1, shadowRadius: 28, width: '100%' },
  accountCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 32, borderWidth: 1, maxWidth: 520, padding: 34, shadowColor: '#24325A', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.1, shadowRadius: 28, width: '100%' },
  segment: { backgroundColor: AppColors.backgroundAlt, borderRadius: 999, flexDirection: 'row', marginBottom: 24, padding: 5 },
  segmentButton: { alignItems: 'center', borderRadius: 999, flex: 1, minHeight: 42, justifyContent: 'center' },
  segmentActive: { backgroundColor: AppColors.yellow },
  segmentText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 13 },
  segmentTextActive: { color: AppColors.primary },
  passport: { alignItems: 'center', flexDirection: 'row', gap: 16, marginBottom: 16 },
  avatar: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderColor: AppColors.yellow, borderRadius: 38, borderWidth: 3, height: 76, justifyContent: 'center', overflow: 'hidden', width: 76 },
  avatarImage: { height: 76, width: 76 },
  passportTitle: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 22 },
  passportId: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 14, marginTop: 3 },
  fieldLabel: { color: AppColors.mutedText, fontFamily: AppFonts.bodyExtraBold, fontSize: 9, letterSpacing: 1, marginBottom: 8, marginTop: 12, textTransform: 'uppercase' },
  input: { borderColor: '#60697A', borderRadius: 4, borderWidth: 1.4, color: AppColors.text, fontFamily: AppFonts.bodyMedium, fontSize: 16, minHeight: 58, paddingHorizontal: 16 },
  rememberRow: { alignItems: 'center', flexDirection: 'row', marginTop: 22 },
  checkbox: { alignItems: 'center', borderColor: '#D4DAEB', borderRadius: 7, borderWidth: 2, height: 30, justifyContent: 'center', width: 30 },
  checkboxChecked: { backgroundColor: AppColors.accent, borderColor: AppColors.accent },
  rememberText: { color: AppColors.text, flex: 1, fontFamily: AppFonts.body, fontSize: 15, marginLeft: 12 },
  adminLink: { color: AppColors.accent, fontFamily: AppFonts.bodyBold, fontSize: 13 },
  errorBox: { alignItems: 'center', backgroundColor: '#FFF0F1', borderRadius: 14, flexDirection: 'row', gap: 8, marginTop: 18, padding: 12 },
  errorText: { color: AppColors.secondary, flex: 1, fontFamily: AppFonts.bodyMedium, fontSize: 12 },
  primaryButton: { alignItems: 'center', backgroundColor: AppColors.yellow, borderRadius: 999, justifyContent: 'center', minHeight: 56, paddingHorizontal: 24, shadowColor: AppColors.yellow, shadowOffset: { width: 0, height: 9 }, shadowOpacity: 0.25, shadowRadius: 15 },
  submit: { marginTop: 26 },
  primaryText: { color: AppColors.primary, fontFamily: AppFonts.bodyExtraBold, fontSize: 16 },
  secondaryButton: { alignItems: 'center', backgroundColor: AppColors.backgroundAlt, borderColor: '#DDE2F3', borderRadius: 999, borderWidth: 1, justifyContent: 'center', minHeight: 52, paddingHorizontal: 24 },
  secondaryText: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 15 },
  accountKicker: { color: AppColors.accent, fontFamily: AppFonts.bodyExtraBold, fontSize: 10, letterSpacing: 1.2, marginTop: 16 },
  accountTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 30, marginTop: 6, textAlign: 'center' },
  accountEmail: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 14, marginTop: 4 },
  accountActions: { alignSelf: 'stretch', gap: 12, marginTop: 26 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
});
