import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { AppColors, AppRadius, AppSpacing } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';
import { useProfile } from '@/hooks/use-profile';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const { error, loading, products, refresh } = useProducts();
  const { homeProductLimit, lowStockThreshold } = profile.settings;
  const stockTotal = products.reduce((total, product) => total + product.stock, 0);
  const lowStockTotal = products.filter(
    (product) => product.stock <= lowStockThreshold,
  ).length;
  const categoryTotal = new Set(products.map((product) => product.category)).size;
  const metrics: {
    label: string;
    value: string;
    detail: string;
    icon: IconName;
    tone: string;
    soft: string;
  }[] = [
    { label: 'สินค้าทั้งหมด', value: String(products.length), detail: 'รายการในแค็ตตาล็อก', icon: 'cards-outline', tone: '#2563EB', soft: '#EAF1FF' },
    { label: 'สต็อกคงเหลือ', value: String(stockTotal), detail: 'ใบพร้อมจำหน่าย', icon: 'archive-outline', tone: '#087F8C', soft: '#E7F8F8' },
    { label: 'สต็อกใกล้หมด', value: String(lowStockTotal), detail: 'ควรเติมสินค้า', icon: 'alert-circle-outline', tone: '#C56B16', soft: '#FFF4E5' },
    { label: 'หมวดหมู่', value: String(categoryTotal), detail: 'กลุ่มสินค้า', icon: 'shape-outline', tone: '#B33965', soft: '#FCECF2' },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="ภาพรวมร้าน" searchPlaceholder="ค้นหาการ์ดหรือสินค้า..." actionLabel="+ เพิ่ม" actionHref="/add" />

      <ScrollView style={styles.scroller} contentContainerStyle={styles.content}>
        <View style={styles.pageHeading}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>RAPHI CARD SHOP</Text>
            <Text style={styles.title}>แดชบอร์ดร้านค้า</Text>
            <Text style={styles.subtitle}>เช็กสินค้าและสต็อกล่าสุดได้ในที่เดียว</Text>
          </View>
          <Pressable onPress={() => void refresh()} style={styles.dateBadge}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={18} color={AppColors.primary} />
            <Text style={styles.dateText}>
              {loading
                ? 'กำลังอัปเดตข้อมูล...'
                : error
                  ? 'ใช้ข้อมูลสำรอง · แตะเพื่อลองใหม่'
                  : 'ข้อมูลล่าสุดจาก GitHub'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.metricGrid}>
          {metrics.map((metric) => (
            <Card key={metric.label} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: metric.soft }]}>
                <MaterialCommunityIcons name={metric.icon} size={23} color={metric.tone} />
              </View>
              <Text style={styles.metricLabel}>{metric.label}</Text>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricDetail}>{metric.detail}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.dashboardGrid}>
          <Card style={styles.inventoryPanel}>
            <View style={styles.panelHeading}>
              <View>
                <Text style={styles.panelTitle}>ภาพรวมสต็อก</Text>
                <Text style={styles.panelSubtitle}>จำนวนสินค้าคงเหลือแต่ละรายการ</Text>
              </View>
              <MaterialCommunityIcons name="chart-bar" size={22} color={AppColors.primary} />
            </View>

            <View style={styles.stockList}>
              {products.map((product) => {
                const percentage = Math.max(8, Math.round((product.stock / Math.max(stockTotal, 1)) * 100));
                const lowStock = product.stock <= lowStockThreshold;
                return (
                  <View key={product.id} style={styles.stockRow}>
                    <View style={styles.stockMeta}>
                      <Text style={styles.stockName} numberOfLines={1}>{product.name}</Text>
                      <Text style={[styles.stockCount, lowStock && styles.stockCountLow]}>{product.stock} ใบ</Text>
                    </View>
                    <View style={styles.track}>
                      <View style={[styles.fill, lowStock && styles.fillLow, { width: `${percentage}%` }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>

          <Card style={styles.quickPanel}>
            <Text style={styles.panelTitle}>ทำรายการด่วน</Text>
            <Text style={styles.panelSubtitle}>ไปยังงานที่ใช้บ่อย</Text>
            <View style={styles.quickActions}>
              <Button label="เพิ่มสินค้าใหม่" onPress={() => router.push('/add')} />
              <Button label="จัดการสินค้า" onPress={() => router.push('/admin')} variant="secondary" />
              <Button label="ส่งออกข้อมูล" onPress={() => router.push('/export')} variant="secondary" />
            </View>
            <View style={styles.notice}>
              <MaterialCommunityIcons name="lightbulb-outline" size={20} color="#9A5A12" />
              <Text style={styles.noticeText}>มีสินค้า {lowStockTotal} รายการที่เหลือไม่เกิน {lowStockThreshold} ใบ</Text>
            </View>
          </Card>
        </View>

        <Card style={styles.recentPanel}>
          <View style={styles.panelHeading}>
            <View>
              <Text style={styles.panelTitle}>สินค้าล่าสุด</Text>
              <Text style={styles.panelSubtitle}>รายการที่กำลังแสดงในหน้าร้าน</Text>
            </View>
            <Button label="ดูทั้งหมด" onPress={() => router.push('/projects')} variant="secondary" />
          </View>
          <View style={styles.productList}>
            {products.slice(0, homeProductLimit).map((product) => (
              <View key={product.id} style={styles.productRow}>
                <View style={styles.thumbFrame}>
                  <Image source={{ uri: product.image_url }} style={styles.thumb} contentFit="contain" />
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.category}>{product.category}</Text>
                </View>
                <Text style={styles.price}>{product.location_text}</Text>
                <View style={[styles.stockBadge, product.stock <= lowStockThreshold && styles.stockBadgeLow]}>
                  <Text style={[styles.stockBadgeText, product.stock <= lowStockThreshold && styles.stockBadgeTextLow]}>คงเหลือ {product.stock}</Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  scroller: { flex: 1 },
  content: { alignSelf: 'center', maxWidth: 1180, padding: AppSpacing.pageX, paddingBottom: 40, width: '100%' },
  pageHeading: { alignItems: 'flex-end', flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', marginBottom: 22 },
  headingCopy: { flex: 1, minWidth: 250 },
  eyebrow: { color: AppColors.primary, fontSize: 12, fontWeight: '900', marginBottom: 7 },
  title: { color: AppColors.text, fontSize: 30, fontWeight: '900' },
  subtitle: { color: AppColors.mutedText, fontSize: 15, marginTop: 6 },
  dateBadge: { alignItems: 'center', backgroundColor: AppColors.softPurple, borderRadius: AppRadius.control, flexDirection: 'row', gap: 7, paddingHorizontal: 13, paddingVertical: 10 },
  dateText: { color: AppColors.primaryDark, fontSize: 13, fontWeight: '800' },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: AppSpacing.cardGap },
  metricCard: { flex: 1, minWidth: 205, padding: 18 },
  metricIcon: { alignItems: 'center', borderRadius: 8, height: 42, justifyContent: 'center', marginBottom: 18, width: 42 },
  metricLabel: { color: AppColors.mutedText, fontSize: 13, fontWeight: '700' },
  metricValue: { color: AppColors.text, fontSize: 31, fontWeight: '900', marginTop: 3 },
  metricDetail: { color: AppColors.subtleText, fontSize: 12, marginTop: 3 },
  dashboardGrid: { alignItems: 'stretch', flexDirection: 'row', flexWrap: 'wrap', gap: AppSpacing.cardGap, marginTop: AppSpacing.cardGap },
  inventoryPanel: { flex: 2, minWidth: 300 },
  quickPanel: { flex: 1, minWidth: 270 },
  panelHeading: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  panelTitle: { color: AppColors.text, fontSize: 18, fontWeight: '900' },
  panelSubtitle: { color: AppColors.mutedText, fontSize: 13, marginTop: 4 },
  stockList: { gap: 18, marginTop: 24 },
  stockRow: { gap: 8 },
  stockMeta: { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
  stockName: { color: AppColors.text, flex: 1, fontSize: 13, fontWeight: '800' },
  stockCount: { color: AppColors.accent, fontSize: 12, fontWeight: '900' },
  stockCountLow: { color: '#C56B16' },
  track: { backgroundColor: '#EEF0F4', borderRadius: 4, height: 7, overflow: 'hidden' },
  fill: { backgroundColor: AppColors.accent, borderRadius: 4, height: '100%' },
  fillLow: { backgroundColor: '#E8A341' },
  quickActions: { gap: 10, marginTop: 20 },
  notice: { alignItems: 'flex-start', backgroundColor: '#FFF7E9', borderRadius: 8, flexDirection: 'row', gap: 9, marginTop: 18, padding: 12 },
  noticeText: { color: '#7A4A13', flex: 1, fontSize: 12, fontWeight: '700', lineHeight: 18 },
  recentPanel: { marginTop: AppSpacing.cardGap },
  productList: { marginTop: 14 },
  productRow: { alignItems: 'center', borderTopColor: AppColors.border, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 12, minHeight: 76, paddingVertical: 12 },
  thumbFrame: { alignItems: 'center', backgroundColor: '#F4F5F7', borderRadius: 8, height: 52, justifyContent: 'center', width: 52 },
  thumb: { height: 46, width: 34 },
  productInfo: { flex: 1, minWidth: 150 },
  productName: { color: AppColors.text, fontSize: 14, fontWeight: '900' },
  category: { color: AppColors.mutedText, fontSize: 12, marginTop: 4 },
  price: { color: AppColors.text, fontSize: 14, fontWeight: '900', minWidth: 82, textAlign: 'right' },
  stockBadge: { backgroundColor: AppColors.softMint, borderRadius: AppRadius.pill, paddingHorizontal: 10, paddingVertical: 6 },
  stockBadgeLow: { backgroundColor: '#FFF1DD' },
  stockBadgeText: { color: AppColors.accent, fontSize: 11, fontWeight: '900' },
  stockBadgeTextLow: { color: '#B35F12' },
});
