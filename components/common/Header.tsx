import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppColors, AppRadius } from '@/constants/Colors';
import { profile } from '@/constants/ProfileData';

type HeaderProps = {
  title: string;
  searchPlaceholder: string;
  actionLabel?: string;
  actionHref?: Href;
  filterLabel?: string;
};

export function Header({
  title,
  searchPlaceholder,
  actionLabel,
  actionHref,
  filterLabel = 'Filter',
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Pressable style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>

        <Text style={styles.headerTitle}>{title}</Text>

        <Pressable
          onPress={() => router.push('/admin')}
          style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}>
          <Text style={styles.profileIcon}>{profile.initials}</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor="#999999"
          />
        </View>

        {actionLabel ? (
          <Pressable
            onPress={() => {
              if (actionHref) {
                router.push(actionHref);
              }
            }}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}>
            <Text style={styles.addButtonText}>{actionLabel}</Text>
          </Pressable>
        ) : null}

        <Pressable style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
          <Text style={styles.filterText}>{filterLabel} ▾</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: AppColors.card,
    borderBottomColor: AppColors.border,
    borderBottomWidth: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    width: '100%',
  },
  menuButton: {
    alignItems: 'center',
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  menuIcon: {
    color: '#333333',
    fontSize: 18,
  },
  headerTitle: {
    color: AppColors.primary,
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  profileButton: {
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    flexShrink: 0,
    width: 30,
  },
  profileIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  searchBar: {
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: AppRadius.control,
    flex: 1,
    flexDirection: 'row',
    minHeight: 44,
    minWidth: 118,
    paddingHorizontal: 12,
  },
  searchIcon: {
    color: '#999999',
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    color: AppColors.text,
    flex: 1,
    fontSize: 15,
    minWidth: 0,
    paddingVertical: 8,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    borderRadius: AppRadius.control,
    flexShrink: 0,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 14,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 4,
  },
  filterText: {
    color: AppColors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.78,
  },
});
