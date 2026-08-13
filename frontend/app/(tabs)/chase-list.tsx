import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { Header } from '@/components/common/Header';
import { PatternBackground } from '@/components/common/PatternBackground';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { AppColors, AppFonts } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';

export default function ChaseListScreen() {
  const { width } = useWindowDimensions();
  const { products, loading, refresh } = useProducts();
  const [query, setQuery] = useState('');
  const columns = width >= 1080 ? 4 : 2;
  const compact = width < 560;
  const visible = useMemo(() => products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())), [products, query]);

  return (
    <SafeAreaView style={styles.screen}>
      <PatternBackground />
      {Platform.OS === 'web' && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes floatAnimation {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          .floating-pokemon {
            animation: floatAnimation 3.5s ease-in-out infinite;
          }
        `}} />
      )}
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Chase List" searchPlaceholder="Search your chase list..." actionLabel="Cart" actionHref="/cart" />
      <FlatList
        key={columns}
        data={visible}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        columnWrapperStyle={styles.columns}
        contentContainerStyle={[styles.content, compact && styles.contentCompact]}
        refreshing={loading}
        onRefresh={() => void refresh()}
        renderItem={({ item }) => <View style={styles.cardSlot}><ProjectCard product={item} /></View>}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        ListHeaderComponent={<View><View style={styles.hero}><View style={styles.star}><MaterialCommunityIcons name="star" size={34} color={AppColors.primary} /></View><View style={styles.heroCopy}><Text style={styles.eyebrow}>PERSONAL COLLECTION</Text><Text style={styles.title}>Your Chase List</Text><Text style={styles.subtitle}>Keep the cards you want most in one easy-to-scan collection.</Text></View><Text style={[styles.count, { marginRight: 80 }]}>{products.length}</Text><Image source={require('@/assets/images/dewjemg-bd30c3ed-046a-487a-bf0c-17271409fb1d 1 (1).png')} style={styles.pokemon3D} className="floating-pokemon" contentFit="contain" /></View><View style={styles.search}><MaterialCommunityIcons name="magnify" size={21} color={AppColors.mutedText} /><TextInput accessibilityLabel="Search chase list" value={query} onChangeText={setQuery} style={styles.searchInput} placeholder="Find a card or set" placeholderTextColor={AppColors.subtleText} />{query ? <Pressable onPress={() => setQuery('')}><MaterialCommunityIcons name="close-circle" size={20} color={AppColors.subtleText} /></Pressable> : null}</View><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Saved Cards</Text><Text style={styles.result}>{visible.length} cards</Text></View></View>}
        ListEmptyComponent={<View style={styles.empty}><MaterialCommunityIcons name="star-off-outline" size={46} color={AppColors.primary} /><Text style={styles.emptyTitle}>No matching cards</Text><Text style={styles.emptyText}>Clear the search to see your full chase list.</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 1180, padding: 24, paddingBottom: Platform.OS === 'web' ? 112 : 54, width: '100%' },
  contentCompact: { paddingHorizontal: 16 },
  hero: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 36, flexDirection: 'row', gap: 18, padding: 26, overflow: 'visible', position: 'relative' },
  pokemon3D: { position: 'absolute', right: 10, bottom: -30, width: 140, height: 140, zIndex: 10 },
  star: { alignItems: 'center', backgroundColor: AppColors.yellow, borderRadius: 34, height: 68, justifyContent: 'center', width: 68 },
  heroCopy: { flex: 1 },
  eyebrow: { color: AppColors.accent, fontFamily: AppFonts.bodyExtraBold, fontSize: 9, letterSpacing: 1.2 },
  title: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 34, letterSpacing: -0.8, marginTop: 4 },
  subtitle: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 13, lineHeight: 20, marginTop: 4 },
  count: { color: AppColors.primary, fontFamily: AppFonts.display, fontSize: 42 },
  search: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 999, borderWidth: 1, flexDirection: 'row', gap: 8, marginTop: 24, minHeight: 50, paddingHorizontal: 16 },
  searchInput: { color: AppColors.text, flex: 1, fontFamily: AppFonts.bodyMedium, fontSize: 13 },
  sectionHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 34 },
  sectionTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 28 },
  result: { color: AppColors.primary, fontFamily: AppFonts.bodyBold, fontSize: 12 },
  columns: { gap: 16 },
  cardSlot: { flex: 1, minWidth: 0 },
  gap: { height: 18 },
  empty: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 28, gap: 8, padding: 36 },
  emptyTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 22 },
  emptyText: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 13 },
});
