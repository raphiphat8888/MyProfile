import Feather from '@expo/vector-icons/Feather';
import { fetch } from 'expo/fetch';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type ViewStyle,
  useWindowDimensions,
  View,
} from 'react-native';

import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/components/admin/adminTheme';
import { AppFonts } from '@/constants/Colors';
import { PRODUCT_ASSETS, PRODUCT_IMAGE_FALLBACK } from '@/constants/product-assets';
import type { ProductCreateInput } from '@/contexts/products-context';
import { useAuth } from '@/hooks/use-auth';
import { useProducts } from '@/hooks/use-products';
import { CLOUD_PRODUCTS_URL } from '@/services/products-api';
import type { Product } from '@/types/product';

type ProductForm = {
  category: string;
  description: string;
  image_url: string;
  location_count: string;
  name: string;
  price: string;
  stock: string;
};

const emptyForm: ProductForm = {
  category: 'Single Card',
  description: '',
  image_url: 'https://images.pokemontcg.io/basep/1_hires.png',
  location_count: '1',
  name: '',
  price: '20',
  stock: '1',
};

const webModalViewportStyle = Platform.OS === 'web'
  ? ({ height: '100vh', minHeight: '100vh', width: '100vw' } as unknown as ViewStyle)
  : null;

function productToForm(product: Product): ProductForm {
  return {
    category: product.category,
    description: '',
    image_url: product.image_url,
    location_count: String(product.location_count),
    name: product.name,
    price: String(product.price ?? 20),
    stock: String(product.stock),
  };
}

function formToInput(form: ProductForm): ProductCreateInput {
  return {
    category: form.category.trim(),
    description: form.description.trim(),
    image_url: form.image_url.trim(),
    location_count: Number(form.location_count || 0),
    name: form.name.trim(),
    price: Number(form.price || 0),
    stock: Number(form.stock || 0),
  };
}

function productImage(product: Product) {
  if (PRODUCT_ASSETS[product.id]) {
    return PRODUCT_ASSETS[product.id].hero;
  }

  return /^https?:\/\//i.test(product.image_url) ? { uri: product.image_url } : PRODUCT_IMAGE_FALLBACK;
}

async function fetchProductsWithJwt(token: string) {
  return fetch(`${CLOUD_PRODUCTS_URL}?refresh=${Date.now()}`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

export default function AdminInventoryScreen() {
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const { createProduct, deleteProduct, error, loading, products, refresh, source, updateProduct } = useProducts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isMobile = width < 760;
  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map((product) => product.category))).slice(0, 5)], [products]);
  const filteredProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch = activeCategory === 'All' || product.category === activeCategory;
      const keywordMatch = !keyword || product.name.toLowerCase().includes(keyword) || product.category.toLowerCase().includes(keyword) || product.id.includes(keyword);
      return categoryMatch && keywordMatch;
    });
  }, [activeCategory, products, query]);
  const totalStock = useMemo(() => products.reduce((sum, product) => sum + product.stock, 0), [products]);
  const lowStockCount = useMemo(() => products.filter((product) => product.stock <= 2 || product.badge_status === 'Low in stock').length, [products]);

  async function loadProducts() {
    if (auth.token) {
      await fetchProductsWithJwt(auth.token);
    }
    await refresh();
  }

  function openAddDrawer() {
    setSelectedProduct(null);
    setForm(emptyForm);
    setMessage('');
    setDrawerOpen(true);
  }

  function openEditDrawer(product: Product) {
    setSelectedProduct(product);
    setForm(productToForm(product));
    setMessage('');
    setDrawerOpen(true);
  }

  async function saveProduct() {
    if (!auth.token) {
      setMessage('Admin token is missing. Login again before saving.');
      return;
    }
    if (!form.name.trim() || !form.category.trim()) {
      setMessage('Card name and category are required.');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const input = formToInput(form);
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, input, auth.token);
        setMessage(`Updated ${form.name}.`);
      } else {
        await createProduct(input, auth.token);
        setMessage(`Added ${form.name} to Cloud MySQL.`);
      }
      setDrawerOpen(false);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not save product.');
    } finally {
      setSaving(false);
    }
  }

  async function removeProduct(product: Product) {
    if (!auth.token) {
      setMessage('Admin token is missing. Login again before deleting.');
      return;
    }

    if (Platform.OS === 'web' && typeof window !== 'undefined' && !window.confirm(`Delete ${product.name}?`)) {
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      await deleteProduct(product.id, auth.token);
      setMessage(`Deleted ${product.name}.`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : 'Could not delete product.');
    } finally {
      setSaving(false);
    }
  }

  function renderProduct({ item }: { item: Product }) {
    return (
      <Pressable onPress={() => openEditDrawer(item)} style={({ pressed }) => [styles.productRow, pressed && styles.rowPressed]}>
        <View style={styles.productCell}>
          <Image source={productImage(item)} resizeMode="contain" style={styles.productImage} />
          <View style={styles.productCopy}>
            <Text numberOfLines={1} style={styles.productName}>{item.name}</Text>
            <Text style={styles.productMeta}>ID #{item.id}</Text>
          </View>
        </View>
        {!isMobile ? <Text numberOfLines={1} style={styles.categoryText}>{item.category}</Text> : null}
        <View style={[styles.stockBadge, item.stock <= 2 && styles.stockBadgeLow]}>
          <Text style={[styles.stockText, item.stock <= 2 && styles.stockTextLow]}>{item.stock}</Text>
        </View>
        <View style={styles.rowActions}>
          <Pressable onPress={() => openEditDrawer(item)} style={styles.iconButton}>
            <Feather name="edit-2" size={16} color={adminColors.primary} />
          </Pressable>
          <Pressable onPress={() => void removeProduct(item)} style={styles.iconButton}>
            <Feather name="trash-2" size={16} color={adminColors.danger} />
          </Pressable>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.page}>
      <View style={[styles.header, isMobile && styles.headerStack]}>
        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>TCG store operations</Text>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>Manage cards, stock, product exports, and order status from the live Cloud MySQL catalog.</Text>
        </View>

        <View style={[styles.actions, isMobile && styles.actionsStack]}>
          <View style={styles.statusBadge}>
            <Feather name={source === 'cloud' ? 'cloud' : 'alert-circle'} size={16} color={source === 'cloud' ? adminColors.primary : adminColors.danger} />
            <Text style={styles.statusText}>{source === 'cloud' ? 'Cloud MySQL' : 'Fallback data'}</Text>
          </View>
          <Pressable onPress={() => void loadProducts()} style={styles.secondaryButton}>
            <Feather name="refresh-cw" size={16} color={adminColors.text} />
            <Text style={styles.secondaryButtonText}>Refresh</Text>
          </Pressable>
          <Pressable onPress={openAddDrawer} style={styles.primaryButton}>
            <Feather name="plus" size={16} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Add Product</Text>
          </Pressable>
        </View>
      </View>

      {error || message ? (
        <View style={styles.notice}>
          <Feather name={error ? 'alert-triangle' : 'info'} size={16} color={error ? adminColors.danger : adminColors.primary} />
          <Text style={styles.noticeText}>{error ?? message}</Text>
        </View>
      ) : null}

      <View style={styles.metricGrid}>
        <Metric label="Products" value={String(products.length)} icon="box" />
        <Metric label="Total Stock" value={String(totalStock)} icon="layers" />
        <Metric danger label="Low Stock" value={String(lowStockCount)} icon="alert-triangle" />
        <Metric label="API Source" value={source === 'cloud' ? 'Live' : 'Local'} icon="database" />
      </View>

      <View style={styles.tablePanel}>
        <View style={[styles.tableHeaderBar, isMobile && styles.headerStack]}>
          <View>
            <Text style={styles.sectionTitle}>Products</Text>
            <Text style={styles.sectionHint}>{filteredProducts.length} records in current view</Text>
          </View>
          <View style={[styles.searchBox, isMobile && styles.searchBoxFull]}>
            <Feather name="search" size={16} color={adminColors.muted} />
            <TextInput
              autoCapitalize="none"
              onChangeText={setQuery}
              placeholder="Search cards..."
              placeholderTextColor={adminColors.muted}
              style={styles.searchInput}
              value={query}
            />
          </View>
        </View>

        <View style={styles.categoryStrip}>
          {categories.map((category) => (
            <Pressable key={category} onPress={() => setActiveCategory(category)} style={[styles.tag, activeCategory === category && styles.tagActive]}>
              <Text style={[styles.tagText, activeCategory === category && styles.tagTextActive]}>{category}</Text>
            </Pressable>
          ))}
        </View>

        {!isMobile ? (
          <View style={styles.productHeaderRow}>
            <Text style={[styles.tableLabel, styles.productColumn]}>Product</Text>
            <Text style={styles.tableLabel}>Category</Text>
            <Text style={styles.tableLabel}>Stock</Text>
            <Text style={styles.tableLabel}>Actions</Text>
          </View>
        ) : null}

        {loading ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={adminColors.primary} />
            <Text style={styles.sectionHint}>Loading Cloud MySQL inventory...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={styles.listContent}
            data={filteredProducts}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            showsVerticalScrollIndicator
          />
        )}
      </View>

      <ProductDrawer
        form={form}
        onChange={setForm}
        onClose={() => setDrawerOpen(false)}
        onSave={() => void saveProduct()}
        open={drawerOpen}
        saving={saving}
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
      />
    </View>
  );
}

function Metric({ danger = false, icon, label, value }: { danger?: boolean; icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={[styles.metricCard, danger && styles.metricDanger]}>
      <View style={styles.metricIcon}>
        <Feather name={icon} size={18} color={danger ? adminColors.danger : adminColors.primary} />
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, danger && styles.metricValueDanger]}>{value}</Text>
    </View>
  );
}

function ProductDrawer({
  form,
  onChange,
  onClose,
  onSave,
  open,
  saving,
  title,
}: {
  form: ProductForm;
  onChange: (value: ProductForm) => void;
  onClose: () => void;
  onSave: () => void;
  open: boolean;
  saving: boolean;
  title: string;
}) {
  function setField(field: keyof ProductForm, value: string) {
    onChange({ ...form, [field]: value });
  }

  const drawerContent = (
    <View style={[styles.modalRoot, webModalViewportStyle]}>
      <Pressable style={styles.modalScrim} onPress={onClose} />
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <View>
            <Text style={styles.eyebrow}>{title}</Text>
            <Text style={styles.drawerTitle}>{form.name || 'New Card Sample'}</Text>
          </View>
          <Pressable onPress={onClose} style={styles.iconButton}>
            <Feather name="x" size={18} color={adminColors.text} />
          </Pressable>
        </View>

        <View style={styles.drawerBody}>
          <LabeledInput label="Card Name" onChangeText={(value) => setField('name', value)} placeholder="e.g. Mewtwo EX" value={form.name} />
          <View style={styles.formGrid}>
            <LabeledInput label="Category" onChangeText={(value) => setField('category', value)} value={form.category} />
            <LabeledInput keyboardType="numeric" label="Price" onChangeText={(value) => setField('price', value)} value={form.price} />
          </View>
          <View style={styles.formGrid}>
            <LabeledInput keyboardType="numeric" label="Stock" onChangeText={(value) => setField('stock', value)} value={form.stock} />
            <LabeledInput keyboardType="numeric" label="Stores" onChangeText={(value) => setField('location_count', value)} value={form.location_count} />
          </View>
          <LabeledInput label="Image URL" onChangeText={(value) => setField('image_url', value)} value={form.image_url} />
          <LabeledInput label="Description" multiline onChangeText={(value) => setField('description', value)} placeholder="Short admin note..." value={form.description} />
        </View>

        <View style={styles.drawerFooter}>
          <Pressable onPress={onClose} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </Pressable>
          <Pressable disabled={saving} onPress={onSave} style={[styles.primaryButton, saving && styles.disabledButton]}>
            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Save Product</Text>}
          </Pressable>
        </View>
      </View>
    </View>
  );

  if (Platform.OS === 'web') {
    return open ? drawerContent : null;
  }

  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={onClose}>
      {drawerContent}
    </Modal>
  );
}

function LabeledInput({
  label,
  multiline = false,
  ...props
}: {
  keyboardType?: 'default' | 'numeric';
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={adminColors.muted}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: adminSpacing.sm,
    justifyContent: 'flex-end',
  },
  actionsStack: {
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
  },
  categoryStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: adminSpacing.sm,
    marginTop: adminSpacing.md,
  },
  categoryText: {
    color: adminColors.muted,
    flex: 1,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 13,
  },
  disabledButton: {
    opacity: 0.68,
  },
  drawer: {
    alignSelf: 'stretch',
    backgroundColor: adminColors.panel,
    borderLeftColor: adminColors.border,
    borderLeftWidth: 1,
    maxWidth: 440,
    width: '100%',
  },
  drawerBody: {
    gap: adminSpacing.md,
    padding: adminSpacing.md,
  },
  drawerFooter: {
    borderTopColor: adminColors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    justifyContent: 'flex-end',
    padding: adminSpacing.md,
  },
  drawerHeader: {
    alignItems: 'flex-start',
    borderBottomColor: adminColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.md,
    justifyContent: 'space-between',
    padding: adminSpacing.md,
  },
  drawerTitle: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 24,
    marginTop: adminSpacing.xs,
  },
  eyebrow: {
    color: adminColors.primary,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  formGrid: {
    flexDirection: 'row',
    gap: adminSpacing.md,
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
  headerStack: {
    flexDirection: 'column',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: adminColors.slate100,
    borderColor: adminColors.border,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  input: {
    backgroundColor: adminColors.panel,
    borderColor: adminColors.borderStrong,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    color: adminColors.text,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  inputGroup: {
    flex: 1,
    gap: adminSpacing.sm,
  },
  inputLabel: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: adminSpacing.md,
  },
  loadingBlock: {
    alignItems: 'center',
    flex: 1,
    gap: adminSpacing.md,
    justifyContent: 'center',
    minHeight: 260,
  },
  metricCard: {
    ...adminShadow,
    backgroundColor: adminColors.panel,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flex: 1,
    minWidth: 168,
    padding: adminSpacing.md,
  },
  metricDanger: {
    backgroundColor: adminColors.dangerSoft,
    borderColor: '#FECACA',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: adminSpacing.md,
  },
  metricIcon: {
    alignItems: 'center',
    backgroundColor: adminColors.primarySoft,
    borderRadius: adminRadius.control,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  metricLabel: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1.1,
    marginTop: adminSpacing.md,
    textTransform: 'uppercase',
  },
  metricValue: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 28,
    marginTop: adminSpacing.xs,
  },
  metricValueDanger: {
    color: adminColors.danger,
  },
  modalRoot: {
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
  },
  modalScrim: {
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    flex: 1,
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
    gap: adminSpacing.md,
  },
  primaryButton: {
    alignItems: 'center',
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
  productCell: {
    alignItems: 'center',
    flex: 1.6,
    flexDirection: 'row',
    gap: adminSpacing.md,
    minWidth: 0,
  },
  productColumn: {
    flex: 1.6,
  },
  productCopy: {
    flex: 1,
    minWidth: 0,
  },
  productHeaderRow: {
    alignItems: 'center',
    backgroundColor: adminColors.slate100,
    borderRadius: adminRadius.control,
    flexDirection: 'row',
    gap: adminSpacing.md,
    marginTop: adminSpacing.md,
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  productImage: {
    borderRadius: adminRadius.control,
    height: 48,
    width: 38,
  },
  productMeta: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 11,
    marginTop: 2,
  },
  productName: {
    color: adminColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 14,
  },
  productRow: {
    alignItems: 'center',
    borderBottomColor: adminColors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.md,
    minHeight: 72,
    paddingHorizontal: adminSpacing.md,
  },
  rowActions: {
    flex: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
  },
  rowPressed: {
    backgroundColor: adminColors.primarySoft,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: adminColors.slate100,
    borderColor: adminColors.border,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
    width: 320,
  },
  searchBoxFull: {
    width: '100%',
  },
  searchInput: {
    color: adminColors.text,
    flex: 1,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
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
  sectionHint: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 24,
  },
  statusBadge: {
    alignItems: 'center',
    backgroundColor: adminColors.slate100,
    borderColor: adminColors.border,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    flexDirection: 'row',
    gap: adminSpacing.sm,
    minHeight: 44,
    paddingHorizontal: adminSpacing.md,
  },
  statusText: {
    color: adminColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 13,
  },
  stockBadge: {
    alignItems: 'center',
    backgroundColor: adminColors.primarySoft,
    borderRadius: adminRadius.control,
    minWidth: 42,
    paddingHorizontal: adminSpacing.sm,
    paddingVertical: adminSpacing.sm,
  },
  stockBadgeLow: {
    backgroundColor: adminColors.dangerSoft,
  },
  stockText: {
    color: adminColors.primary,
    fontFamily: AppFonts.bodyBold,
    fontSize: 13,
  },
  stockTextLow: {
    color: adminColors.danger,
  },
  subtitle: {
    color: adminColors.muted,
    fontFamily: AppFonts.bodyMedium,
    fontSize: 14,
    lineHeight: 22,
    marginTop: adminSpacing.xs,
    maxWidth: 620,
  },
  tableHeaderBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: adminSpacing.md,
    justifyContent: 'space-between',
  },
  tableLabel: {
    color: adminColors.muted,
    flex: 1,
    fontFamily: AppFonts.bodyExtraBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tablePanel: {
    ...adminShadow,
    backgroundColor: adminColors.panel,
    borderColor: adminColors.border,
    borderRadius: adminRadius.card,
    borderWidth: 1,
    flex: 1,
    minHeight: 0,
    padding: adminSpacing.md,
  },
  tag: {
    backgroundColor: adminColors.slate100,
    borderColor: adminColors.border,
    borderRadius: adminRadius.control,
    borderWidth: 1,
    paddingHorizontal: adminSpacing.md,
    paddingVertical: adminSpacing.sm,
  },
  tagActive: {
    backgroundColor: adminColors.primary,
    borderColor: adminColors.primary,
  },
  tagText: {
    color: adminColors.text,
    fontFamily: AppFonts.bodyBold,
    fontSize: 12,
  },
  tagTextActive: {
    color: '#FFFFFF',
  },
  textArea: {
    minHeight: 104,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  title: {
    color: adminColors.text,
    fontFamily: AppFonts.displayBold,
    fontSize: 34,
    lineHeight: 40,
    marginTop: adminSpacing.xs,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
});
