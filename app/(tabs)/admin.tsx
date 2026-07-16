import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppColors, AppRadius, AppSpacing } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';
import { useProfile } from '@/hooks/use-profile';
import type { Product } from '@/types/product';

export default function AdminScreen() {
  const { profile } = useProfile();
  const { products: remoteProducts } = useProducts();
  const [products, setProducts] = useState<Product[]>(remoteProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStock, setDraftStock] = useState('');
  const [draftImageUrl, setDraftImageUrl] = useState('');

  useEffect(() => {
    setProducts(remoteProducts);
  }, [remoteProducts]);

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setDraftStock(String(product.stock));
    setDraftImageUrl(product.image_url);
  };

  const saveEdit = (id: string) => {
    setProducts((current) =>
      current.map((product) => {
        if (product.id !== id) {
          return product;
        }

        const parsedStock = Number(draftStock);
        const stock = Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : product.stock;

        return {
          ...product,
          image_url: draftImageUrl || product.image_url,
          stock,
          stock_text: `${stock} in stock`,
          badge_status: stock <= profile.settings.lowStockThreshold ? 'Low in stock' : 'Active',
        };
      }),
    );
    setEditingId(null);
  };

  const deleteProduct = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Admin" searchPlaceholder="Search admin..." actionLabel="+ Add" actionHref="/add" />
      <ScrollView style={styles.scroller} contentContainerStyle={styles.content}>
        <SectionTitle
          eyebrow="Admin"
          title="Manage products"
          description="Preview stock and image changes locally. Update products.json and push to GitHub to publish permanent changes."
        />

        <View style={styles.list}>
          {products.map((product) => (
            <Card key={product.id} style={styles.productCard}>
              <View style={styles.thumbFrame}>
                {product.image_url ? (
                  <Image source={{ uri: product.image_url }} style={styles.thumb} contentFit="contain" />
                ) : null}
                <View style={styles.thumbFallbackBox}>
                  <Text style={styles.thumbFallback}>{product.name.slice(0, 1)}</Text>
                  <Text style={styles.thumbName}>{product.category}</Text>
                </View>
              </View>
              <View style={styles.productTop}>
                <View style={styles.productInfo}>
                  <Text style={styles.title}>{product.name}</Text>
                  <Text style={styles.meta}>{product.category} / {product.location_text}</Text>
                </View>
                <Text style={styles.price}>{product.badge_status}</Text>
              </View>

              {editingId === product.id ? (
                <View style={styles.editArea}>
                  <TextInput
                    autoCapitalize="none"
                    style={styles.input}
                    value={draftImageUrl}
                    onChangeText={setDraftImageUrl}
                    placeholder="Image URL"
                  />
                  <TextInput
                    style={styles.input}
                    value={draftStock}
                    onChangeText={setDraftStock}
                    placeholder="Stock"
                    keyboardType="number-pad"
                  />
                  <View style={styles.actions}>
                    <Button label="Save" onPress={() => saveEdit(product.id)} />
                    <Button label="Cancel" onPress={() => setEditingId(null)} variant="secondary" />
                  </View>
                </View>
              ) : (
                <View style={styles.actions}>
                  <Text style={styles.stock}>Stock {product.stock}</Text>
                  <Button label="Edit" onPress={() => startEdit(product)} variant="secondary" />
                  <Button label="Delete" onPress={() => deleteProduct(product.id)} />
                </View>
              )}
            </Card>
          ))}
        </View>
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
  list: {
    gap: AppSpacing.cardGap,
  },
  productCard: {
    gap: 14,
  },
  thumbFrame: {
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: AppRadius.control,
    height: 150,
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  thumb: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
  },
  thumbFallbackBox: {
    alignItems: 'center',
    backgroundColor: AppColors.softPurple,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  thumbFallback: {
    color: AppColors.primary,
    fontSize: 44,
    fontWeight: '900',
  },
  thumbName: {
    color: AppColors.primary,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 4,
  },
  productTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  productInfo: {
    flex: 1,
    minWidth: 220,
  },
  title: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  meta: {
    color: AppColors.mutedText,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  price: {
    color: AppColors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  stock: {
    color: AppColors.text,
    fontSize: 14,
    fontWeight: '900',
    marginRight: 'auto',
  },
  editArea: {
    gap: 10,
  },
  input: {
    backgroundColor: '#F4F5F7',
    borderColor: AppColors.border,
    borderRadius: AppRadius.control,
    borderWidth: 1,
    color: AppColors.text,
    fontSize: 15,
    minHeight: 44,
    paddingHorizontal: 12,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
