import Feather from '@expo/vector-icons/Feather';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';

import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';
import { fetchSegmentationProducts, type SegmentationProduct } from '@/services/segmentation-api';

type Segment = {
  centroid: number;
  items: SegmentationProduct[];
  max: number;
  min: number;
  name: string;
};

const segmentNames = {
  3: ['Economy', 'Standard', 'Premium'],
  4: ['Entry', 'Value', 'Core', 'Premium'],
} as const;

function strategyFor(segmentName: string) {
  if (segmentName === 'Premium') return 'Protect margin and highlight rarity.';
  if (segmentName === 'Core' || segmentName === 'Standard') return 'Keep stable pricing for core demand.';
  if (segmentName === 'Value') return 'Use bundles and measured promotions.';
  return 'Use as an entry point for shoppers.';
}

function runKMeans(products: SegmentationProduct[], clusterCount: number): Segment[] {
  const sorted = [...products].sort((left, right) => left.price - right.price);
  if (sorted.length === 0) return [];
  let centroids = Array.from({ length: clusterCount }, (_, index) => {
    const position = Math.round((index * (sorted.length - 1)) / (clusterCount - 1));
    return sorted[position].price;
  });

  for (let iteration = 0; iteration < 30; iteration += 1) {
    const groups = centroids.map(() => [] as SegmentationProduct[]);
    sorted.forEach((product) => {
      const nearest = centroids.reduce((bestIndex, centroid, index) => (
        Math.abs(product.price - centroid) < Math.abs(product.price - centroids[bestIndex]) ? index : bestIndex
      ), 0);
      groups[nearest].push(product);
    });
    const nextCentroids = groups.map((group, index) => (
      group.length > 0 ? group.reduce((sum, product) => sum + product.price, 0) / group.length : centroids[index]
    ));
    if (nextCentroids.every((centroid, index) => Math.abs(centroid - centroids[index]) < 0.001)) break;
    centroids = nextCentroids;
  }

  const groups = centroids.map(() => [] as SegmentationProduct[]);
  sorted.forEach((product) => {
    const nearest = centroids.reduce((bestIndex, centroid, index) => (
      Math.abs(product.price - centroid) < Math.abs(product.price - centroids[bestIndex]) ? index : bestIndex
    ), 0);
    groups[nearest].push(product);
  });

  return groups
    .map((items, index) => ({
      centroid: centroids[index],
      items,
      max: Math.max(...items.map((item) => item.price)),
      min: Math.min(...items.map((item) => item.price)),
      name: segmentNames[clusterCount][index],
    }))
    .filter((segment) => segment.items.length > 0)
    .sort((left, right) => left.centroid - right.centroid);
}

function money(value: number) {
  return `$${value.toFixed(2)}`;
}

function pricePosition(price: number, minimum: number, maximum: number) {
  if (maximum <= minimum) return 50;
  return ((price - minimum) / (maximum - minimum)) * 100;
}

export default function AdminSegmentationScreen() {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const [clusterCount, setClusterCount] = useState(4);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<SegmentationProduct[]>([]);
  const isMobile = width < 760;
  const segments = useMemo(() => runKMeans(products, clusterCount), [clusterCount, products]);
  const productRows = useMemo(() => segments.flatMap((segment) => segment.items.map((product) => ({
    centroid: segment.centroid,
    product,
    segment: segment.name,
  }))), [segments]);

  const loadData = useCallback(async () => {
    if (!auth.token) {
      setError('Admin token is missing. Login again to analyze prices.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      setProducts(await fetchSegmentationProducts(auth.token));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not load segmentation data.');
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>Pricing intelligence</Text>
          <Text style={styles.title}>Price Segmentation</Text>
          <Text style={styles.subtitle}>Group live catalog prices into practical tiers for smarter Pokémon card pricing decisions.</Text>
        </View>
        <Pressable onPress={() => void loadData()} style={styles.refreshButton}>
          <Feather name="refresh-cw" size={16} color={adminColors.text} />
          <Text style={styles.refreshText}>Analyze live data</Text>
        </Pressable>
      </View>

      <View style={styles.controlRow}>
        <View>
          <Text style={styles.controlLabel}>Number of segments</Text>
          <Text style={styles.controlHint}>K-Means clusters based on price</Text>
        </View>
        <View style={styles.segmentedControl}>
          {[3, 4].map((value) => (
            <Pressable key={value} onPress={() => setClusterCount(value)} style={[styles.segmentButton, clusterCount === value && styles.segmentButtonActive]}>
              <Text style={[styles.segmentButtonText, clusterCount === value && styles.segmentButtonTextActive]}>{value} groups</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {error ? <View style={styles.notice}><Feather name="alert-triangle" size={17} color={adminColors.danger} /><Text style={styles.noticeText}>{error}</Text></View> : null}
      {loading ? <View style={styles.loading}><ActivityIndicator color={adminColors.primary} /><Text style={styles.loadingText}>Loading live Cloud MySQL prices...</Text></View> : null}

      {!loading && !error ? (
        <>
          <View style={styles.metrics}>
            <Metric label="Cards analyzed" value={String(products.length)} icon="database" />
            <Metric label="Lowest price" value={products.length ? money(Math.min(...products.map((item) => item.price))) : '-'} icon="arrow-down" />
            <Metric label="Highest price" value={products.length ? money(Math.max(...products.map((item) => item.price))) : '-'} icon="arrow-up" />
          </View>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View><Text style={styles.panelTitle}>K-Means price map</Text><Text style={styles.panelHint}>Each dot is a card. Dots are assigned to the nearest price centroid.</Text></View>
              <Text style={styles.sourceBadge}>PRICE AXIS</Text>
            </View>
            <PriceClusterChart segments={segments} />
          </View>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View><Text style={styles.panelTitle}>Segment definition</Text><Text style={styles.panelHint}>Centroid is the average price in each cluster.</Text></View>
              <Text style={styles.sourceBadge}>LIVE DATA</Text>
            </View>
            {segments.map((segment) => (
              <View key={segment.name} style={styles.row}>
                <View style={styles.nameCell}><View style={styles.dot} /><View><Text style={styles.segmentName}>{segment.name}</Text><Text style={styles.itemCount}>{segment.items.length} cards</Text></View></View>
                <View style={styles.priceCell}><Text style={styles.range}>{money(segment.min)} - {money(segment.max)}</Text><Text style={styles.centroid}>Centroid {money(segment.centroid)}</Text></View>
                <Text style={styles.strategy}>{strategyFor(segment.name)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View><Text style={styles.panelTitle}>Card-level results</Text><Text style={styles.panelHint}>Every live product assigned to its nearest price centroid.</Text></View>
              <Text style={styles.sourceBadge}>{productRows.length} CARDS</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.cardColumn]}>CARD</Text>
                  <Text style={[styles.tableHeaderText, styles.clusterColumn]}>CLUSTER</Text>
                  <Text style={[styles.tableHeaderText, styles.priceColumn]}>PRICE</Text>
                  <Text style={[styles.tableHeaderText, styles.centroidColumn]}>CENTROID</Text>
                </View>
                {productRows.map(({ centroid, product, segment }) => (
                  <View key={product.product_id} style={styles.tableRow}>
                    <View style={styles.cardColumn}><Text numberOfLines={1} style={styles.cardName}>{product.product_name}</Text><Text style={styles.cardId}>ID #{product.product_id}</Text></View>
                    <View style={styles.clusterColumn}><Text style={styles.clusterBadge}>{segment}</Text></View>
                    <Text style={[styles.tableValue, styles.priceColumn]}>{money(product.price)}</Text>
                    <Text style={[styles.tableValue, styles.centroidColumn]}>{money(centroid)}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}

function PriceClusterChart({ segments }: { segments: Segment[] }) {
  const allPrices = segments.flatMap((segment) => segment.items.map((item) => item.price));
  const minimum = Math.min(...allPrices, 0);
  const maximum = Math.max(...allPrices, 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => minimum + (maximum - minimum) * ratio);

  return (
    <View style={styles.chart}>
      <View style={styles.chartPlot}>
        <View style={styles.chartAxis} />
        {segments.map((segment) => (
          <View key={segment.name} style={styles.chartRow}>
            <View style={styles.chartLabel}><View style={styles.dot} /><Text style={styles.chartLabelText}>{segment.name}</Text></View>
            <View style={styles.chartTrack}>
              <View style={[styles.centroidLine, { left: `${pricePosition(segment.centroid, minimum, maximum)}%` }]} />
              {segment.items.map((item, index) => (
                <View
                  key={item.product_id}
                  style={[
                    styles.priceDot,
                    { left: `${pricePosition(item.price, minimum, maximum)}%`, top: index % 2 === 0 ? 7 : 25 },
                  ]}
                />
              ))}
            </View>
            <Text style={styles.chartRange}>{money(segment.min)} - {money(segment.max)}</Text>
          </View>
        ))}
        <View style={styles.chartTicks}>
          {ticks.map((tick) => <Text key={tick} style={styles.tickText}>{money(tick)}</Text>)}
        </View>
      </View>
      <View style={styles.chartLegend}><View style={styles.legendItem}><View style={styles.priceDotLegend} /><Text style={styles.legendText}>Card price</Text></View><View style={styles.legendItem}><View style={styles.centroidLegend} /><Text style={styles.legendText}>Centroid</Text></View></View>
    </View>
  );
}

function Metric({ icon, label, value }: { icon: React.ComponentProps<typeof Feather>['name']; label: string; value: string }) {
  return <View style={styles.metric}><Feather name={icon} size={17} color={adminColors.primary} /><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  content: { gap: adminSpacing.lg, paddingBottom: 48 },
  header: { alignItems: 'flex-start', flexDirection: 'row', gap: adminSpacing.lg, justifyContent: 'space-between' },
  headerMobile: { flexDirection: 'column' },
  titleBlock: { flex: 1 },
  eyebrow: { color: adminColors.primary, fontFamily: AppFonts.bodyExtraBold, fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: adminColors.text, fontFamily: AppFonts.displayBold, fontSize: 32, marginTop: 5 },
  subtitle: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 14, lineHeight: 21, marginTop: 7, maxWidth: 650 },
  refreshButton: { alignItems: 'center', borderColor: adminColors.borderStrong, borderRadius: adminRadius.control, borderWidth: 1, flexDirection: 'row', gap: 8, minHeight: 44, paddingHorizontal: adminSpacing.md },
  refreshText: { color: adminColors.text, fontFamily: AppFonts.bodyBold, fontSize: 13 },
  controlRow: { alignItems: 'center', backgroundColor: adminColors.panel, borderColor: adminColors.border, borderRadius: adminRadius.panel, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: adminSpacing.md },
  controlLabel: { color: adminColors.text, fontFamily: AppFonts.bodyBold, fontSize: 14 },
  controlHint: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 12, marginTop: 3 },
  segmentedControl: { backgroundColor: adminColors.slate100, borderRadius: adminRadius.control, flexDirection: 'row', padding: 3 },
  segmentButton: { borderRadius: adminRadius.control, paddingHorizontal: 14, paddingVertical: 9 },
  segmentButtonActive: { backgroundColor: adminColors.primary },
  segmentButtonText: { color: adminColors.muted, fontFamily: AppFonts.bodyBold, fontSize: 12 },
  segmentButtonTextActive: { color: '#FFFFFF' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: adminSpacing.md },
  metric: { ...adminShadow, backgroundColor: adminColors.panel, borderColor: adminColors.border, borderRadius: adminRadius.panel, borderWidth: 1, flex: 1, minWidth: 170, padding: adminSpacing.md },
  metricLabel: { color: adminColors.muted, fontFamily: AppFonts.bodyBold, fontSize: 11, marginTop: 12, textTransform: 'uppercase' },
  metricValue: { color: adminColors.text, fontFamily: AppFonts.displayBold, fontSize: 24, marginTop: 4 },
  panel: { ...adminShadow, backgroundColor: adminColors.panel, borderColor: adminColors.border, borderRadius: adminRadius.panel, borderWidth: 1, overflow: 'hidden' },
  panelHeader: { alignItems: 'center', borderBottomColor: adminColors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', padding: adminSpacing.lg },
  panelTitle: { color: adminColors.text, fontFamily: AppFonts.displayBold, fontSize: 19 },
  panelHint: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 12, marginTop: 4 },
  sourceBadge: { backgroundColor: adminColors.primarySoft, borderRadius: adminRadius.control, color: adminColors.primary, fontFamily: AppFonts.bodyExtraBold, fontSize: 10, paddingHorizontal: 9, paddingVertical: 6 },
  row: { alignItems: 'center', borderBottomColor: adminColors.border, borderBottomWidth: 1, flexDirection: 'row', gap: adminSpacing.md, paddingHorizontal: adminSpacing.lg, paddingVertical: adminSpacing.md },
  nameCell: { alignItems: 'center', flex: 0.9, flexDirection: 'row', gap: 10 },
  dot: { backgroundColor: adminColors.primary, borderRadius: 8, height: 10, width: 10 },
  segmentName: { color: adminColors.text, fontFamily: AppFonts.bodyBold, fontSize: 14 },
  itemCount: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 11, marginTop: 2 },
  priceCell: { flex: 1.1 },
  range: { color: adminColors.text, fontFamily: AppFonts.bodyBold, fontSize: 14 },
  centroid: { color: adminColors.primary, fontFamily: AppFonts.bodyMedium, fontSize: 11, marginTop: 3 },
  strategy: { color: adminColors.muted, flex: 1.6, fontFamily: AppFonts.bodyMedium, fontSize: 12, lineHeight: 18 },
  table: { minWidth: 700, width: '100%' },
  tableHeader: { alignItems: 'center', backgroundColor: adminColors.slate100, flexDirection: 'row', minHeight: 42, paddingHorizontal: adminSpacing.lg },
  tableHeaderText: { color: adminColors.muted, fontFamily: AppFonts.bodyExtraBold, fontSize: 10, letterSpacing: 1 },
  tableRow: { alignItems: 'center', borderBottomColor: adminColors.border, borderBottomWidth: 1, flexDirection: 'row', minHeight: 66, paddingHorizontal: adminSpacing.lg },
  cardColumn: { width: 300 },
  clusterColumn: { width: 150 },
  priceColumn: { width: 120 },
  centroidColumn: { width: 130 },
  cardName: { color: adminColors.text, fontFamily: AppFonts.bodyBold, fontSize: 13 },
  cardId: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 11, marginTop: 3 },
  clusterBadge: { backgroundColor: adminColors.primarySoft, borderRadius: adminRadius.control, color: adminColors.primary, fontFamily: AppFonts.bodyBold, fontSize: 12, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6 },
  tableValue: { color: adminColors.text, fontFamily: AppFonts.bodyBold, fontSize: 13 },
  notice: { alignItems: 'center', backgroundColor: adminColors.dangerSoft, borderColor: '#FECACA', borderRadius: adminRadius.card, borderWidth: 1, flexDirection: 'row', gap: 9, padding: adminSpacing.md },
  noticeText: { color: adminColors.danger, flex: 1, fontFamily: AppFonts.bodyBold, fontSize: 13 },
  loading: { alignItems: 'center', gap: 10, padding: adminSpacing.xl },
  loadingText: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 13 },
  chart: { padding: adminSpacing.lg },
  chartPlot: { minWidth: 680, paddingBottom: 30, position: 'relative' },
  chartAxis: { backgroundColor: adminColors.border, bottom: 27, height: 1, left: 110, position: 'absolute', right: 105 },
  chartRow: { alignItems: 'center', flexDirection: 'row', minHeight: 58 },
  chartLabel: { alignItems: 'center', flexDirection: 'row', gap: 8, width: 100 },
  chartLabelText: { color: adminColors.text, fontFamily: AppFonts.bodyBold, fontSize: 12 },
  chartTrack: { backgroundColor: adminColors.slate100, borderRadius: 8, flex: 1, height: 40, position: 'relative' },
  priceDot: { backgroundColor: adminColors.primary, borderColor: '#FFFFFF', borderRadius: 6, borderWidth: 1, height: 12, marginLeft: -6, position: 'absolute', width: 12 },
  centroidLine: { backgroundColor: adminColors.danger, bottom: 3, position: 'absolute', top: 3, width: 2 },
  chartRange: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 11, textAlign: 'right', width: 100 },
  chartTicks: { flexDirection: 'row', justifyContent: 'space-between', marginLeft: 110, marginRight: 105, marginTop: 3 },
  tickText: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 10 },
  chartLegend: { flexDirection: 'row', gap: adminSpacing.lg, marginLeft: 100, marginTop: adminSpacing.md },
  legendItem: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  legendText: { color: adminColors.muted, fontFamily: AppFonts.bodyMedium, fontSize: 11 },
  priceDotLegend: { backgroundColor: adminColors.primary, borderRadius: 5, height: 10, width: 10 },
  centroidLegend: { backgroundColor: adminColors.danger, height: 14, width: 2 },
});