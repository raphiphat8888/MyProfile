import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ProjectCard } from '@/components/profile/ProjectCard';
import { AppColors, AppRadius, AppSpacing } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';

export default function ProjectsScreen() {
  const { error, loading, products, refresh, source } = useProducts();

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header
        title="Products"
        searchPlaceholder="Search products..."
        actionLabel="+ Add Product"
        actionHref="/add"
      />

      <FlatList
        data={products}
        keyExtractor={(product) => product.id}
        renderItem={({ item }) => <ProjectCard product={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        refreshing={loading}
        onRefresh={() => void refresh()}
        ListHeaderComponent={
          <View>
            <SectionTitle
              eyebrow="GitHub product feed"
              title="Pokemon products from products.json"
              description="Product cards below are rendered from the Raw JSON file in this GitHub repository. Pull down to request the latest version."
            />

            <View style={[styles.sourceBar, error && styles.sourceBarError]}>
              {loading ? <ActivityIndicator size="small" color={AppColors.primary} /> : null}
              <View style={styles.sourceCopy}>
                <Text style={styles.sourceLabel}>
                  {loading ? 'Loading GitHub data' : source === 'github' ? 'Live from GitHub' : 'Local fallback'}
                </Text>
                <Text style={styles.sourceDetail}>
                  {error ?? `${products.length} products loaded and ready to display`}
                </Text>
              </View>
              {error ? <Button label="Retry" onPress={() => void refresh()} variant="secondary" /> : null}
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptyText}>Add product records to products.json and refresh this page.</Text>
              <Button label="Refresh products" onPress={() => void refresh()} />
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: AppColors.background,
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 980,
    padding: AppSpacing.pageX,
    paddingBottom: AppSpacing.pageBottom,
    width: '100%',
  },
  separator: {
    height: AppSpacing.cardGap,
  },
  sourceBar: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderColor: '#CFE0FF',
    borderRadius: AppRadius.control,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
    padding: 14,
  },
  sourceBarError: {
    backgroundColor: '#FFF7E9',
    borderColor: '#F1D4A7',
  },
  sourceCopy: {
    flex: 1,
    minWidth: 190,
  },
  sourceLabel: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  sourceDetail: {
    color: AppColors.mutedText,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: AppColors.card,
    borderColor: AppColors.border,
    borderRadius: AppRadius.card,
    borderWidth: 1,
    gap: 10,
    padding: 28,
  },
  emptyTitle: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  emptyText: {
    color: AppColors.mutedText,
    fontSize: 14,
    lineHeight: 21,
    maxWidth: 480,
    textAlign: 'center',
  },
});
