import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Platform,
  useWindowDimensions,
  View,
} from 'react-native';

import { PatternBackground } from '@/components/common/PatternBackground';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { AppColors, AppFonts } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';

export default function AllProductsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { error, loading, products, refresh } = useProducts();

  const [category, setCategory] = useState('All Items');
  const [query, setQuery] = useState('');

  const columns = width >= 1080 ? 4 : width >= 700 ? 3 : 2;
  const compact = width < 560;

  const filters = useMemo(
    () => ['All Items', ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const visibleProducts = useMemo(() => {
    const byCategory =
      category === 'All Items' ? products : products.filter((p) => p.category === category);
    if (!query.trim()) return byCategory;
    const q = query.trim().toLowerCase();
    return byCategory.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q),
    );
  }, [products, category, query]);

  return (
    <SafeAreaView style={styles.screen}>
      <PatternBackground />
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />

      {/* ── Top Bar ── */}
      <View style={[styles.topBar, compact && styles.topBarCompact]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={AppColors.primary} />
        </Pressable>

        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>All Cards</Text>
          <Text style={styles.pageSubtitle}>{visibleProducts.length} items</Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={18} color={AppColors.mutedText} />
          <TextInput
            placeholder="Search cards…"
            placeholderTextColor={AppColors.mutedText}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, webSearchInputStyle]}
            clearButtonMode="while-editing"
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <MaterialCommunityIcons name="close-circle" size={16} color={AppColors.mutedText} />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Filter Pills ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}>
        {filters.map((f) => {
          const active = f === category;
          return (
            <Pressable
              key={f}
              onPress={() => setCategory(f)}
              style={[styles.pill, active && styles.pillActive]}>
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{f}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Grid ── */}
      <FlatList
        key={columns}
        data={visibleProducts}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={[styles.list, compact && styles.listCompact]}
        refreshing={loading}
        onRefresh={() => void refresh()}
        renderItem={({ item }) => (
          <View style={styles.cardSlot}>
            <ProjectCard product={item} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.rowGap} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="cards-outline" size={48} color={AppColors.primary} />
            <Text style={styles.emptyTitle}>
              {error ? 'Could not load catalog' : 'No cards found'}
            </Text>
            <Text style={styles.emptyText}>
              {error
                ? 'Pull down to retry'
                : query
                  ? 'Try a different search term'
                  : 'Try a different category filter'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },

  /* top bar */
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  topBarCompact: { paddingHorizontal: 16 },
  backBtn: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderRadius: 16,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  backBtnPressed: { opacity: 0.7, transform: [{ scale: 0.93 }] },
  titleBlock: { flex: 1 },
  pageTitle: {
    color: AppColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 28,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  pageSubtitle: {
    color: AppColors.mutedText,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 13,
    lineHeight: 18,
  },

  /* search */
  searchBox: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flex: 1,
    maxWidth: 300,
  },
  searchInput: {
    color: AppColors.text,
    flex: 1,
    fontFamily: AppFonts.body,
    fontSize: 14,
  },

  /* filter pills */
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  pill: {
    backgroundColor: AppColors.softBlue,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  pillActive: {
    backgroundColor: AppColors.yellow,
    shadowColor: AppColors.yellow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
  pillText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyBold, fontSize: 15, textAlign: 'center' },
  pillTextActive: { color: AppColors.primary },

  /* grid */
  list: {
    alignSelf: 'center',
    maxWidth: 1180,
    paddingBottom: 54,
    paddingHorizontal: 24,
    width: '100%',
  },
  listCompact: { paddingHorizontal: 16 },
  columns: { gap: 16 },
  cardSlot: { flex: 1, minWidth: 0 },
  rowGap: { height: 18 },

  /* empty */
  empty: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    gap: 8,
    marginTop: 40,
    padding: 36,
  },
  emptyTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 22 },
  emptyText: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 13, textAlign: 'center' },
});

const webSearchInputStyle =
  Platform.OS === 'web'
    ? ({
        outlineWidth: 0,
        outlineStyle: 'none',
        outlineColor: 'transparent',
      } as const)
    : null;
