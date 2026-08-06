import Feather from '@expo/vector-icons/Feather';
import { fetch } from 'expo/fetch';
import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';
import { useProducts } from '@/hooks/use-products';
import { CLOUD_API_URL } from '@/services/products-api';
import type { Product } from '@/types/product';

type ExportFormat = 'json' | 'csv';

async function fetchBackupProducts(token: string): Promise<Product[]> {
  const response = await fetch(`${CLOUD_API_URL}/api/products`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Export request failed (${response.status})`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Export response is not a product list.');
  }

  return data as Product[];
}

function escapeCsvValue(value: unknown) {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function productsToCsv(products: Product[]) {
  const headers: (keyof Product)[] = [
    'id',
    'name',
    'category',
    'price',
    'stock',
    'stock_text',
    'location_count',
    'location_text',
    'badge_status',
    'image_url',
  ];

  const rows = products.map((product) => headers.map((header) => escapeCsvValue(product[header])).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function downloadTextFile(fileName: string, payload: string, type: string) {
  const blob = new Blob([payload], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminExportScreen() {
  const auth = useAuth();
  const { products, source } = useProducts();
  const [message, setMessage] = useState('');
  const [working, setWorking] = useState(false);

  async function handleDownload(format: ExportFormat) {
    if (!auth.token) {
      setMessage('Admin token is missing. Login again before exporting.');
      return;
    }

    setWorking(true);
    setMessage('');
    try {
      const cloudProducts = await fetchBackupProducts(auth.token);
      const exportProducts = cloudProducts.length > 0 ? cloudProducts : products;
      const dateStamp = new Date().toISOString().slice(0, 10);
      const isCsv = format === 'csv';
      const payload = isCsv
        ? `\uFEFF${productsToCsv(exportProducts)}`
        : JSON.stringify(exportProducts, null, 2);
      const fileName = `pokemon-takt-backup-${dateStamp}.${format}`;
      const fileType = isCsv ? 'text/csv;charset=utf-8' : 'application/json';

      if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof document !== 'undefined') {
        downloadTextFile(fileName, payload, fileType);
        setMessage(`Downloaded ${fileName}.`);
      } else {
        setMessage(`${format.toUpperCase()} backup is ready. Download is available in the web build.`);
      }
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not prepare backup.');
    } finally {
      setWorking(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.page}>
      <View style={styles.panel}>
        <View style={styles.iconBox}>
          <Feather name="download-cloud" size={28} color={adminColors.primary} />
        </View>
        <Text style={styles.eyebrow}>Backup Center</Text>
        <Text style={styles.title}>Export Catalog Data</Text>
        <Text style={styles.subtitle}>
          Download a JSON or CSV snapshot of the current TCG inventory. The request is configured with the admin JWT token and reads from the {source === 'cloud' ? 'Cloud MySQL' : 'fallback'} catalog.
        </Text>

        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Products</Text>
            <Text style={styles.statValue}>{products.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Format</Text>
            <Text style={styles.statValue}>JSON / CSV</Text>
          </View>
        </View>

        {message ? (
          <View style={styles.notice}>
            <Feather name="info" size={16} color={adminColors.primary} />
            <Text style={styles.noticeText}>{message}</Text>
          </View>
        ) : null}

        <View style={styles.actionRow}>
          <Pressable disabled={working} onPress={() => void handleDownload('json')} style={[styles.primaryButton, working && styles.disabledButton]}>
            {working ? <ActivityIndicator color="#FFFFFF" /> : <Feather name="download" size={16} color="#FFFFFF" />}
            <Text style={styles.primaryButtonText}>Download JSON</Text>
          </Pressable>
          <Pressable disabled={working} onPress={() => void handleDownload('csv')} style={[styles.secondaryButton, working && styles.disabledButton]}>
            <Feather name="file-text" size={16} color={adminColors.primary} />
            <Text style={styles.secondaryButtonText}>Download CSV</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: adminSpacing.sm,
  },
  content: {
    paddingBottom: adminSpacing.xl,
  },
  disabledButton: {
    opacity: 0.68,
  },
  eyebrow: {
    color: adminColors.primary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: adminSpacing.md,
    textTransform: 'uppercase',
  },
  iconBox: {
    alignItems: 'center',
    backgroundColor: adminColors.primarySoft,
    borderRadius: adminRadius.card,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  notice: {
    alignItems: 'center',
    backgroundColor: adminColors.primarySoft,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    padding: adminSpacing.md,
  },
  noticeText: {
    color: adminColors.text,
    flex: 1,
    fontFamily: AppFonts.bodyBold,
    fontSize: 13,
  },
  page: {
    backgroundColor: adminColors.background,
    flex: 1,
  },
  panel: {
    ...adminShadow,
    backgroundColor: adminColors.panel,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    maxWidth: 720,
    padding: adminSpacing.xl,
  },
  primaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: adminColors.primary,
    borderRadius: adminRadius.control,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  secondaryButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: adminColors.panel,
    borderColor: adminColors.borderStrong,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  secondaryButtonText: {
    color: adminColors.primary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  statCard: {
    backgroundColor: adminColors.slate100,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flex: 1,
    minWidth: 160,
    padding: adminSpacing.md,
  },
  statLabel: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: adminSpacing.md,
    marginVertical: adminSpacing.xl,
  },
  statValue: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 26,
    marginTop: adminSpacing.xs,
  },
  subtitle: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 15,
    lineHeight: 24,
    marginTop: adminSpacing.sm,
    maxWidth: 620,
  },
  title: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 34,
    lineHeight: 40,
    marginTop: adminSpacing.xs,
  },
});
