import { Link, Redirect, Slot, usePathname } from 'expo-router';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View, Pressable, useWindowDimensions, ScrollView } from 'react-native';

import { PatternBackground } from '@/components/common/PatternBackground';
import { adminColors, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts, AppColors } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLayout() {
  const auth = useAuth();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isMobile = width < 760;

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
      <PatternBackground />
      <View style={StyleSheet.flatten([styles.header, isMobile && styles.headerMobile])}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>Pokémon Takt Shop</Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.adminBadge}>Admin</Text>
          </View>
        </View>
        
        {isMobile ? (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.navGroupMobile}
            style={styles.scrollViewMobile}
          >
            <Link href="/admin/inventory" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/inventory' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/inventory' && styles.navTextActive])}>Inventory</Text>
              </Pressable>
            </Link>
            <Link href="/admin/orders" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/orders' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/orders' && styles.navTextActive])}>Orders</Text>
              </Pressable>
            </Link>
            <Link href="/admin/export" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/export' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/export' && styles.navTextActive])}>Export</Text>
              </Pressable>
            </Link>
            <Link href="/admin/segmentation" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/segmentation' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/segmentation' && styles.navTextActive])}>Price Segmentation</Text>
              </Pressable>
            </Link>
            <Link href="/" asChild>
              <Pressable style={styles.exitButton}>
                <Text style={styles.exitButtonText}>Shop Front</Text>
              </Pressable>
            </Link>
          </ScrollView>
        ) : (
          <View style={styles.navGroup}>
            <Link href="/admin/inventory" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/inventory' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/inventory' && styles.navTextActive])}>Inventory</Text>
              </Pressable>
            </Link>
            <Link href="/admin/orders" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/orders' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/orders' && styles.navTextActive])}>Orders</Text>
              </Pressable>
            </Link>
            <Link href="/admin/export" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/export' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/export' && styles.navTextActive])}>Export</Text>
              </Pressable>
            </Link>
            <Link href="/admin/segmentation" asChild>
              <Pressable style={StyleSheet.flatten([styles.navLink, pathname === '/admin/segmentation' && styles.navLinkActive])}>
                <Text style={StyleSheet.flatten([styles.navText, pathname === '/admin/segmentation' && styles.navTextActive])}>Price Segmentation</Text>
              </Pressable>
            </Link>
            <Link href="/" asChild>
              <Pressable style={styles.exitButton}>
                <Text style={styles.exitButtonText}>Shop Front</Text>
              </Pressable>
            </Link>
          </View>
        )}
      </View>
      <View style={StyleSheet.flatten([styles.mainContent, isMobile && styles.mainContentMobile])}>
        <Slot />
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
  screen: {
    backgroundColor: adminColors.background,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'rgba(249, 249, 255, 0.96)',
    borderBottomColor: '#DDE2F3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    zIndex: 10,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  scrollViewMobile: {
    width: '100%',
  },
  navGroupMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTitle: {
    color: AppColors.primary,
    fontFamily: AppFonts.display,
    fontSize: 25,
    letterSpacing: -0.7,
  },
  badgeContainer: {
    backgroundColor: AppColors.yellow,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adminBadge: {
    color: AppColors.primaryDark,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  navLink: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navLinkActive: {
    backgroundColor: AppColors.softBlue,
  },
  navText: {
    color: AppColors.mutedText,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  navTextActive: {
    color: AppColors.accent,
  },
  exitButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exitButtonText: {
    color: '#FFFFFF',
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  mainContent: {
    flex: 1,
    padding: 24,
  },
  mainContentMobile: {
    padding: 12,
  },
});

