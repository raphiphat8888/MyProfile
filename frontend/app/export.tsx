import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { PatternBackground } from '@/components/common/PatternBackground';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppColors, AppFonts, AppSpacing } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';

const csvValue = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;

export default function ExportScreen() {
  const { products } = useProducts();
  const [status, setStatus] = useState('Ready when you are.');
  const csv = [
    'id,name,stock,stock_text,category,location_count,location_text,badge_status,image_url',
    ...products.map((product) => [product.id, product.name, product.stock, product.stock_text, product.category, product.location_count, product.location_text, product.badge_status, product.image_url].map(csvValue).join(',')),
  ].join('\n');

  const handleShare = async () => {
    setStatus('Opening share options...');
    try {
      await Share.share({ message: csv, title: 'Card Quest product export' });
      setStatus('CSV prepared successfully.');
    } catch {
      setStatus('Could not open sharing. You can still select the CSV below.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <PatternBackground />
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Export station" searchPlaceholder="Search exports..." actionLabel="Add" actionHref="/add" />
      <ScrollView contentContainerStyle={styles.content}>
        <SectionTitle eyebrow="Data delivery" title="Pack the catalog as CSV" description="The export is formatted for Excel and Google Sheets, including every product currently loaded in the app." />

        <View style={styles.layout}>
          <Card style={styles.summaryCard}>
            <View style={styles.exportArt}>
              <MaterialCommunityIcons name="file-delimited-outline" color={AppColors.text} size={50} />
              <View style={styles.artSpark}><MaterialCommunityIcons name="star-four-points" color={AppColors.text} size={17} /></View>
            </View>
            <Text style={styles.summaryEyebrow}>EXPORT READY</Text>
            <Text style={styles.summaryValue}>{products.length}</Text>
            <Text style={styles.summaryLabel}>products packed into one CSV</Text>
            <View style={styles.checkList}>
              {['Header row included', 'Values safely quoted', 'Spreadsheet friendly'].map((item) => (
                <View key={item} style={styles.checkRow}><MaterialCommunityIcons name="check-circle" color={AppColors.accent} size={18} /><Text style={styles.checkText}>{item}</Text></View>
              ))}
            </View>
            <Button label="Share CSV" onPress={() => void handleShare()} />
            <Text style={styles.status}>{status}</Text>
          </Card>

          <Card style={styles.previewCard}>
            <View style={styles.previewHeading}>
              <View><Text style={styles.previewEyebrow}>FILE PREVIEW</Text><Text style={styles.previewTitle}>products.csv</Text></View>
              <View style={styles.rowBadge}><Text style={styles.rowBadgeText}>{products.length + 1} ROWS</Text></View>
            </View>
            <View style={styles.codeFrame}>
              <Text selectable style={styles.code}>{csv}</Text>
            </View>
            <View style={styles.helpBar}><MaterialCommunityIcons name="cursor-text" color={AppColors.text} size={19} /><Text style={styles.helpText}>Long-press or drag to select text manually.</Text></View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 1080, padding: AppSpacing.pageX, paddingBottom: 36, width: '100%' },
  layout: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  summaryCard: { backgroundColor: AppColors.yellow, flex: 1, minWidth: 260 },
  exportArt: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 24, height: 85, justifyContent: 'center', position: 'relative', shadowColor: '#24325A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, width: 85 },
  artSpark: { alignItems: 'center', backgroundColor: AppColors.pink, borderRadius: 14, height: 28, justifyContent: 'center', position: 'absolute', right: -9, top: -9, width: 28 },
  summaryEyebrow: { color: AppColors.text, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginTop: 20, opacity: 0.62 },
  summaryValue: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 48, letterSpacing: -1.5, marginTop: 2 },
  summaryLabel: { color: AppColors.text, fontFamily: AppFonts.bodyExtraBold, fontSize: 13 },
  checkList: { gap: 9, marginVertical: 20 },
  checkRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  checkText: { color: AppColors.text, fontSize: 11, fontWeight: '800' },
  status: { color: AppColors.text, fontSize: 10, fontWeight: '700', lineHeight: 15, marginTop: 11, textAlign: 'center' },
  previewCard: { flex: 2, minWidth: 300 },
  previewHeading: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginBottom: 15 },
  previewEyebrow: { color: AppColors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  previewTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 20, marginTop: 3 },
  rowBadge: { backgroundColor: AppColors.aqua, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  rowBadgeText: { color: AppColors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.6 },
  codeFrame: { backgroundColor: '#17233B', borderRadius: 20, maxHeight: 420, overflow: 'hidden', padding: 14 },
  code: { color: '#E9F0FF', fontFamily: 'monospace', fontSize: 11, lineHeight: 19 },
  helpBar: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderColor: AppColors.text, borderRadius: 12, borderWidth: 1.5, flexDirection: 'row', gap: 8, marginTop: 13, padding: 10 },
  helpText: { color: AppColors.text, flex: 1, fontSize: 10, fontWeight: '800' },
});
