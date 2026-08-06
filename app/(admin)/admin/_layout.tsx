import { Redirect, Slot } from 'expo-router';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { Sidebar } from '@/components/Sidebar';
import { adminColors, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLayout() {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const compactSidebar = width < 980;

  if (auth.loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color={adminColors.primary} size="large" />
        <Text style={styles.loadingText}>Loading admin session...</Text>
      </SafeAreaView>
    );
  }

  if (!auth.user || !auth.isAdmin) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.shell}>
        <Sidebar compact={compactSidebar} />
        <View style={styles.mainContent}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    alignItems: 'center',
    backgroundColor: adminColors.background,
    flex: 1,
    gap: adminSpacing.md,
    justifyContent: 'center',
  },
  loadingText: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  mainContent: {
    backgroundColor: adminColors.background,
    flex: 1,
    minWidth: 0,
  },
  screen: {
    backgroundColor: adminColors.background,
    flex: 1,
  },
  shell: {
    backgroundColor: adminColors.background,
    flex: 1,
    flexDirection: 'row',
    gap: adminSpacing.md,
    padding: adminSpacing.md,
  },
});
