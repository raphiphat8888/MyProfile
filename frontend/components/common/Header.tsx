import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { AppColors, AppFonts, AppRadius } from '@/constants/Colors';
import { useCart } from '@/hooks/use-cart';

type HeaderProps = {
  title: string;
  searchPlaceholder: string;
  actionLabel?: string;
  actionHref?: Href;
  filterLabel?: string;
};

export function Header({ title, searchPlaceholder, actionLabel, actionHref }: HeaderProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { totalItems } = useCart();
  const showSearch = width >= 760;
  const isCartAction = actionLabel?.toLowerCase() === 'cart' || actionHref === '/cart' || actionHref === '/categories';
  const actionIcon = isCartAction ? 'shopping-outline' : 'badge-account-outline';

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/')} style={styles.brandMark}>
          <MaterialCommunityIcons name="view-grid-outline" color={AppColors.primary} size={23} />
        </Pressable>
        <View style={styles.titleCopy}>
          <Text style={styles.brandTitle}>Pokémon Takt Shop</Text>
          {width >= 620 ? <Text style={styles.pageLabel}>{title}</Text> : null}
        </View>

        {showSearch ? (
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" color={AppColors.mutedText} size={22} />
            <TextInput
              accessibilityLabel="Search catalog"
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={AppColors.subtleText}
            />
          </View>
        ) : (
          <Pressable accessibilityLabel="Search" style={styles.iconButton}>
            <MaterialCommunityIcons name="magnify" color={AppColors.mutedText} size={28} />
          </Pressable>
        )}

        {actionLabel ? (
          <Pressable
            onPress={() => actionHref && router.push(actionHref)}
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
            <MaterialCommunityIcons name={actionIcon} color={AppColors.primary} size={23} />
            {isCartAction && totalItems > 0 ? <View style={styles.notificationBadge}><Text style={styles.notificationText}>{totalItems > 99 ? '99+' : totalItems}</Text></View> : null}
          </Pressable>
        ) : (
          <Pressable onPress={() => router.push('/profile')} style={styles.profileButton}>
            <MaterialCommunityIcons name="badge-account-outline" color={AppColors.primary} size={23} />
          </Pressable>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: 'rgba(249,249,255,0.96)', shadowColor: '#24325A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, zIndex: 20 },
  header: { alignItems: 'center', alignSelf: 'center', flexDirection: 'row', gap: 10, maxWidth: 1120, minHeight: 72, paddingHorizontal: 20, paddingVertical: 10, width: '100%' },
  brandMark: { alignItems: 'center', height: 40, justifyContent: 'center', width: 40 },
  titleCopy: { flex: 1 },
  brandTitle: { color: AppColors.primary, fontFamily: AppFonts.display, fontSize: 25, letterSpacing: -0.7 },
  pageLabel: { color: AppColors.subtleText, fontFamily: AppFonts.bodyBold, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase' },
  iconButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  profileButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  actionButton: { alignItems: 'center', height: 44, justifyContent: 'center', position: 'relative', width: 44 },
  notificationBadge: { alignItems: 'center', backgroundColor: AppColors.red, borderColor: '#FFFFFF', borderRadius: 11, borderWidth: 2, height: 22, justifyContent: 'center', position: 'absolute', right: -1, top: -2, width: 22 },
  notificationText: { color: '#FFFFFF', fontFamily: AppFonts.bodyExtraBold, fontSize: 10 },
  searchBar: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: AppRadius.pill, flexDirection: 'row', gap: 8, maxWidth: 360, minHeight: 44, paddingHorizontal: 15, width: '38%' },
  searchInput: { color: AppColors.text, flex: 1, fontFamily: AppFonts.bodyMedium, fontSize: 13, minWidth: 0, paddingVertical: 9 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
