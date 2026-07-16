import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppColors, AppSpacing } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';

export default function ExportScreen() {
  const { products } = useProducts();
  const csv = [
    'id,name,stock,stock_text,category,location_count,location_text,badge_status,image_url',
    ...products.map((product) =>
      [
        product.id,
        product.name,
        product.stock,
        product.stock_text,
        product.category,
        product.location_count,
        product.location_text,
        product.badge_status,
        product.image_url,
      ].join(','),
    ),
  ].join('\n');

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Export" searchPlaceholder="Search exports..." actionLabel="+ Add" actionHref="/add" />
      <ScrollView style={styles.scroller} contentContainerStyle={styles.content}>
        <SectionTitle
          eyebrow="Export"
          title="Export product data"
          description="Copy this CSV into Excel or Google Sheets. A backend can later generate downloadable files."
        />

        <Card>
          <View style={styles.summary}>
            <Text style={styles.summaryValue}>{products.length}</Text>
            <Text style={styles.summaryLabel}>products ready to export</Text>
          </View>
          <Text selectable style={styles.code}>
            {csv}
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: AppColors.background,
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    maxWidth: 980,
    padding: AppSpacing.pageX,
    paddingBottom: AppSpacing.pageBottom,
    width: '100%',
  },
  summary: {
    marginBottom: 16,
  },
  summaryValue: {
    color: AppColors.primary,
    fontSize: 34,
    fontWeight: '900',
  },
  summaryLabel: {
    color: AppColors.mutedText,
    fontSize: 14,
    fontWeight: '800',
  },
  code: {
    backgroundColor: '#F4F5F7',
    borderColor: AppColors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: AppColors.text,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 22,
    padding: 14,
  },
});
