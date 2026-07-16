import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppColors, AppRadius, AppSpacing } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';

type CategorySummary = {
  name: string;
  productCount: number;
  stockTotal: number;
  locationTotal: number;
};

export default function CategoriesScreen() {
  const { products } = useProducts();
  const categories = Array.from(
    products.reduce((summary, product) => {
      const current = summary.get(product.category) ?? {
        name: product.category,
        productCount: 0,
        stockTotal: 0,
        locationTotal: 0,
      };

      current.productCount += 1;
      current.stockTotal += product.stock;
      current.locationTotal += product.location_count;
      summary.set(product.category, current);
      return summary;
    }, new Map<string, CategorySummary>()),
  ).map(([, summary]) => summary);

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header
        title="Categories"
        searchPlaceholder="Search categories..."
        actionLabel="+ Add Product"
        actionHref="/add"
      />

      <FlatList
        data={categories}
        keyExtractor={(category) => category.name}
        contentContainerStyle={styles.content}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <SectionTitle
            eyebrow="Catalog structure"
            title="Product categories"
            description="Category totals are calculated from the products downloaded from GitHub."
          />
        }
        renderItem={({ item, index }) => (
          <Card style={styles.categoryCard}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="shape-outline" size={24} color={AppColors.primary} />
            </View>
            <View style={styles.categoryCopy}>
              <Text style={styles.categoryIndex}>CATEGORY {String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.categoryName}>{item.name}</Text>
            </View>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{item.productCount}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{item.stockTotal}</Text>
                <Text style={styles.statLabel}>In stock</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{item.locationTotal}</Text>
                <Text style={styles.statLabel}>Stores</Text>
              </View>
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <Card style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No categories yet</Text>
            <Text style={styles.emptyText}>Categories will appear after products.json contains product records.</Text>
          </Card>
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
  categoryCard: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    borderRadius: AppRadius.control,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  categoryCopy: {
    flex: 1,
    minWidth: 180,
  },
  categoryIndex: {
    color: AppColors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  categoryName: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stat: {
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    minWidth: 78,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  statValue: {
    color: AppColors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  statLabel: {
    color: AppColors.mutedText,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
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
    textAlign: 'center',
  },
});
