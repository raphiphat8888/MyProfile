import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';

const profileTrainerImage = require('@/assets/images/profile-trainer-master.png');

export default function AdminEntryScreen() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('admin@pokemon-takt.shop');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  if (!auth.loading && auth.isAdmin) {
    return <Redirect href="/admin/inventory" />;
  }

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Enter the admin email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const user = await auth.login(email, password);
      if (user.role !== 'admin') {
        auth.logout();
        setError('This account is not allowed to open the admin dashboard.');
        return;
      }
      router.replace('/admin/inventory');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Admin login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.shell}>
        <View style={styles.brandPanel}>
          <View style={styles.brandIcon}>
            <Feather name="grid" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.brandTitle}>Pokémon Takt Shop</Text>
          <Text style={styles.brandSubtitle}>Staff-only inventory console connected to Cloud MySQL.</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.identityRow}>
            <Image source={profileTrainerImage} style={styles.avatar} contentFit="cover" />
            <View style={styles.identityCopy}>
              <Text style={styles.title}>Admin Console</Text>
              <Text style={styles.subtitle}>ID: {email.trim() || 'admin@pokemon-takt.shop'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email or Trainer ID</Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="admin@pokemon-takt.shop"
                placeholderTextColor={adminColors.muted}
                style={styles.input}
                value={email}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                onChangeText={setPassword}
                placeholder="Admin password"
                placeholderTextColor={adminColors.muted}
                secureTextEntry
                style={styles.input}
                value={password}
              />
            </View>

            <View style={styles.metaRow}>
              <Pressable onPress={() => setRemember((value) => !value)} style={[styles.checkbox, remember && styles.checkboxActive]}>
                {remember ? <Feather name="check" size={16} color="#FFFFFF" /> : null}
              </Pressable>
              <Text style={styles.rememberText}>Remember Me</Text>
              <Pressable onPress={() => router.push('/login')}>
                <Text style={styles.userLink}>User Login</Text>
              </Pressable>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={adminColors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Pressable disabled={loading} onPress={() => void handleLogin()} style={[styles.primaryButton, loading && styles.disabledButton]}>
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Login as Admin</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: adminRadius.control,
    height: 72,
    width: 72,
  },
  brandIcon: {
    alignItems: 'center',
    backgroundColor: adminColors.primary,
    borderRadius: adminRadius.card,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  brandPanel: {
    backgroundColor: adminColors.sidebar,
    borderRadius: adminRadius.panel,
    gap: adminSpacing.md,
    maxWidth: 380,
    padding: adminSpacing.xl,
    width: '100%',
  },
  brandSubtitle: {
    color: adminColors.sidebarMuted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 24,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontFamily: AppFonts.displayBold,
    fontSize: 34,
    lineHeight: 40,
  },
  card: {
    ...adminShadow,
    backgroundColor: adminColors.panel,
    borderColor: adminColors.border,
    borderRadius: adminRadius.panel,
    borderWidth: 1,
    maxWidth: 560,
    padding: adminSpacing.xl,
    width: '100%',
  },
  checkbox: {
    alignItems: 'center',
    borderColor: adminColors.borderStrong,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  checkboxActive: {
    backgroundColor: adminColors.primary,
    borderColor: adminColors.primary,
  },
  disabledButton: {
    opacity: 0.68,
  },
  divider: {
    backgroundColor: adminColors.border,
    height: 1,
    marginVertical: adminSpacing.lg,
  },
  errorBox: {
    alignItems: 'center',
    backgroundColor: adminColors.dangerSoft,
    borderColor: '#FECACA',
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    padding: adminSpacing.md,
  },
  errorText: {
    color: adminColors.danger,
    flex: 1,
    fontFamily: AppFonts.bodyBold,
    fontSize: 13,
  },
  form: {
    gap: adminSpacing.md,
  },
  identityCopy: {
    flex: 1,
    minWidth: 0,
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: adminSpacing.md,
  },
  input: {
    backgroundColor: adminColors.panel,
    borderColor: adminColors.borderStrong,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    color: adminColors.text,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: adminSpacing.md,
  },
  inputGroup: {
    gap: adminSpacing.sm,
  },
  label: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: adminSpacing.sm,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: adminColors.primary,
    borderRadius: adminRadius.control,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: adminSpacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: AppFonts.bodyBold,
    fontSize: 15,
  },
  rememberText: {
    color: adminColors.text,
    flex: 1,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
  },
  screen: {
    backgroundColor: adminColors.background,
    flex: 1,
  },
  shell: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: adminSpacing.md,
    justifyContent: 'center',
    padding: adminSpacing.lg,
  },
  subtitle: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
    marginTop: adminSpacing.xs,
  },
  title: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 28,
    lineHeight: 34,
  },
  userLink: {
    color: adminColors.primary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
});
