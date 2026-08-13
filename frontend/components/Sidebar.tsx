import Feather from '@expo/vector-icons/Feather';
import { Link, type Href, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { UserProfileDropdown } from '@/components/admin/UserProfileDropdown';
import { adminColors, adminRadius, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';

const profileTrainerImage = require('@/assets/images/profile-trainer-master.png');

type SidebarProps = {
  compact?: boolean;
};

type NavItem = {
  href: Href;
  icon: keyof typeof Feather.glyphMap;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/admin/inventory' as Href, icon: 'grid', label: 'Inventory' },
  { href: '/admin/orders' as Href, icon: 'clipboard', label: 'Orders' },
  { href: '/admin/export' as Href, icon: 'download', label: 'Export' },
];

export function Sidebar({ compact = false }: SidebarProps) {
  const auth = useAuth();
  const pathname = usePathname();

  return (
    <View style={[styles.sidebar, compact && styles.sidebarCompact]}>
      <View style={styles.topGroup}>
        <UserProfileDropdown
          avatarSource={profileTrainerImage}
          compact={compact}
          name={auth.user?.name ?? 'Takt Admin'}
          onLogout={auth.logout}
          role="Inventory Console"
        />

        <View style={styles.navGroup}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={String(item.href)} href={item.href} asChild>
                <Pressable
                  accessibilityRole="link"
                  style={({ pressed }) => [
                    styles.navItem,
                    compact && styles.navItemCompact,
                    active && styles.navItemActive,
                    pressed && styles.navItemPressed,
                  ]}
                >
                  <Feather name={item.icon} size={18} color={active ? '#FFFFFF' : adminColors.sidebarMuted} />
                  {!compact ? (
                    <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
                  ) : null}
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navGroup: {
    gap: adminSpacing.sm,
  },
  navItem: {
    alignItems: 'center',
    borderRadius: adminRadius.control,
    flexDirection: 'row',
    gap: adminSpacing.md,
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  navItemActive: {
    backgroundColor: adminColors.primary,
  },
  navItemCompact: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  navItemPressed: {
    backgroundColor: adminColors.slate700,
  },
  navText: {
    color: adminColors.sidebarMuted,
    flex: 1,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  navTextActive: {
    color: '#FFFFFF',
  },
  sidebar: {
    backgroundColor: adminColors.sidebar,
    borderRadius: adminRadius.panel,
    height: '100%',
    padding: adminSpacing.md,
    width: 240,
  },
  sidebarCompact: {
    alignItems: 'center',
    width: 88,
  },
  topGroup: {
    gap: adminSpacing.xl,
    width: '100%',
  },
});
