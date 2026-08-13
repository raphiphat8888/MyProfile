import Feather from '@expo/vector-icons/Feather';
import { fetch } from 'expo/fetch';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/hooks/use-profile';
import { CLOUD_API_URL } from '@/services/products-api';

type OrderStatus = 'Pending' | 'Packing' | 'Ready';

type AdminOrder = {
  created_at: string;
  id: string;
  status: OrderStatus;
  total_amount: number;
};

const sampleOrders: AdminOrder[] = [
  { created_at: '2026-07-29T12:30:00.000Z', id: '9823', status: 'Packing', total_amount: 145.5 },
  { created_at: '2026-07-29T09:20:00.000Z', id: '9822', status: 'Pending', total_amount: 450 },
  { created_at: '2026-07-28T16:10:00.000Z', id: '9821', status: 'Ready', total_amount: 88 },
];

function isOrderStatus(value: unknown): value is OrderStatus {
  return value === 'Pending' || value === 'Packing' || value === 'Ready';
}

function parseOrders(data: unknown): AdminOrder[] {
  if (!Array.isArray(data)) {
    return sampleOrders;
  }

  return data
    .filter((item): item is Record<string, unknown> => typeof item === 'object' && item !== null)
    .map((item) => ({
      created_at: typeof item.created_at === 'string' ? item.created_at : new Date().toISOString(),
      id: typeof item.id === 'string' || typeof item.id === 'number' ? String(item.id) : 'draft',
      status: isOrderStatus(item.status) ? item.status : 'Pending',
      total_amount: typeof item.total_amount === 'number' ? item.total_amount : 0,
    }));
}

async function fetchOrders(token: string): Promise<AdminOrder[]> {
  const response = await fetch(`${CLOUD_API_URL}/api/orders`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const data: unknown = await response.json();

  if (!response.ok) {
    throw new Error(`Orders request failed (${response.status}).`);
  }

  return parseOrders(data);
}

export default function AdminOrdersScreen() {
  const auth = useAuth();
  const { profile } = useProfile();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const loadOrders = useCallback(async () => {
    if (!auth.token) {
      setError('Admin token is missing. Login again to load orders.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      setOrders(await fetchOrders(auth.token));
    } catch (caught) {
      setOrders(sampleOrders);
      setError(caught instanceof Error ? `${caught.message} Showing sample orders.` : 'Could not load orders. Showing sample orders.');
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Fulfillment</Text>
          <Text style={styles.title}>Orders</Text>
          <Text style={styles.subtitle}>Track checkout requests, packing status, and ready-for-pickup orders.</Text>
        </View>
        <Pressable onPress={() => void loadOrders()} style={styles.secondaryButton}>
          <Feather name="refresh-cw" size={16} color={adminColors.text} />
          <Text style={styles.secondaryButtonText}>Refresh</Text>
        </Pressable>
      </View>

      {error ? (
        <View style={styles.notice}>
          <Feather name="alert-triangle" size={16} color={adminColors.warning} />
          <Text style={styles.noticeText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.listPanel}>
        {loading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={adminColors.primary} />
            <Text style={styles.subtitle}>Loading order queue...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <OrderRow currency={profile.settings.currency} order={item} />}
            showsVerticalScrollIndicator
          />
        )}
      </View>
    </View>
  );
}

function OrderRow({ currency, order }: { currency: string; order: AdminOrder }) {
  const date = new Date(order.created_at);
  const statusStyle = order.status === 'Pending'
    ? styles.statusPending
    : order.status === 'Packing'
      ? styles.statusPacking
      : styles.statusReady;

  return (
    <View style={styles.orderRow}>
      <View style={styles.orderIcon}>
        <Feather name="shopping-bag" size={18} color={adminColors.primary} />
      </View>
      <View style={styles.orderCopy}>
        <Text style={styles.orderTitle}>Order #{order.id}</Text>
        <Text style={styles.orderMeta}>{date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <Text style={styles.orderPrice}>{currency} {order.total_amount.toFixed(2)}</Text>
      <View style={[styles.statusBadge, statusStyle]}>
        <Text style={styles.statusText}>{order.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    color: adminColors.primary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  header: {
    alignItems: 'flex-start',
    backgroundColor: adminColors.panel,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.md,
    justifyContent: 'space-between',
    padding: adminSpacing.md,
  },
  listContent: {
    paddingBottom: adminSpacing.md,
  },
  listPanel: {
    ...adminShadow,
    backgroundColor: adminColors.panel,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flex: 1,
    minHeight: 0,
    padding: adminSpacing.md,
  },
  loadingBlock: {
    alignItems: 'center',
    flex: 1,
    gap: adminSpacing.md,
    justifyContent: 'center',
  },
  notice: {
    alignItems: 'center',
    backgroundColor: adminColors.warningSoft,
    borderColor: '#FDE68A',
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
  orderCopy: {
    flex: 1,
    minWidth: 0,
  },
  orderIcon: {
    alignItems: 'center',
    backgroundColor: adminColors.primarySoft,
    borderRadius: adminRadius.control,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  orderMeta: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 12,
    marginTop: 2,
  },
  orderPrice: {
    color: adminColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 16,
  },
  orderRow: {
    alignItems: 'center',
    borderBottomColor: adminColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.md,
    minHeight: 76,
    paddingHorizontal: adminSpacing.sm,
  },
  orderTitle: {
    color: adminColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 15,
  },
  page: {
    backgroundColor: adminColors.background,
    flex: 1,
    gap: adminSpacing.md,
  },
  secondaryButton: {
    alignItems: 'center',
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
    color: adminColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: adminRadius.control,
    minWidth: 88,
    paddingHorizontal: adminSpacing.sm,
    paddingVertical: adminSpacing.sm,
  },
  statusPacking: {
    backgroundColor: adminColors.warningSoft,
  },
  statusPending: {
    backgroundColor: adminColors.dangerSoft,
  },
  statusReady: {
    backgroundColor: adminColors.primarySoft,
  },
  statusText: {
    color: adminColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  subtitle: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 22,
    marginTop: adminSpacing.xs,
  },
  title: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 34,
    lineHeight: 40,
    marginTop: adminSpacing.xs,
  },
});
