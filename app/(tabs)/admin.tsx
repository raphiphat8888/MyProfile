import { useState } from 'react';
import { Image } from 'expo-image';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppColors, AppRadius, AppSpacing } from '@/constants/Colors';
import { profile } from '@/constants/ProfileData';
import type { Project } from '@/types/profile';

export default function AdminScreen() {
  const [products, setProducts] = useState<Project[]>(profile.projects);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [draftPrice, setDraftPrice] = useState('');
  const [draftStock, setDraftStock] = useState('');
  const [draftImageUrl, setDraftImageUrl] = useState('');

  const startEdit = (product: Project) => {
    setEditingTitle(product.title);
    setDraftPrice(product.price);
    setDraftStock(String(product.stock));
    setDraftImageUrl(product.imageUrl ?? '');
  };

  const saveEdit = (title: string) => {
    setProducts((current) =>
      current.map((product) =>
        product.title === title
          ? {
              ...product,
              imageUrl: draftImageUrl || product.imageUrl,
              price: draftPrice || product.price,
              stock: Number(draftStock) || product.stock,
            }
          : product,
      ),
    );
    setEditingTitle(null);
  };

  const deleteProduct = (title: string) => {
    setProducts((current) => current.filter((product) => product.title !== title));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Admin" searchPlaceholder="Search admin..." actionLabel="+ Add" actionHref="/add" />
      <ScrollView style={styles.scroller} contentContainerStyle={styles.content}>
        <SectionTitle
          eyebrow="Admin"
          title="Manage products"
          description="Edit price and stock, delete unavailable products, or jump to the add product screen."
        />

        <View style={styles.list}>
          {products.map((product) => (
            <Card key={product.title} style={styles.productCard}>
              <View style={styles.thumbFrame}>
                {product.imageUrl ? (
                  <Image source={{ uri: product.imageUrl }} style={styles.thumb} contentFit="contain" />
                ) : null}
                <View style={styles.thumbFallbackBox}>
                  <Text style={styles.thumbFallback}>{product.title.slice(0, 1)}</Text>
                  <Text style={styles.thumbName}>{product.category}</Text>
                </View>
              </View>
              <View style={styles.productTop}>
                <View style={styles.productInfo}>
                  <Text style={styles.title}>{product.title}</Text>
                  <Text style={styles.meta}>{product.category} / {product.status}</Text>
                </View>
                <Text style={styles.price}>{product.price}</Text>
              </View>

              {editingTitle === product.title ? (
                <View style={styles.editArea}>
                  <TextInput style={styles.input} value={draftPrice} onChangeText={setDraftPrice} placeholder="Price" />
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
                    <Button label="Save" onPress={() => saveEdit(product.title)} />
                    <Button label="Cancel" onPress={() => setEditingTitle(null)} variant="secondary" />
                  </View>
                </View>
              ) : (
                <View style={styles.actions}>
                  <Text style={styles.stock}>Stock {product.stock}</Text>
                  <Button label="Edit" onPress={() => startEdit(product)} variant="secondary" />
                  <Button label="Delete" onPress={() => deleteProduct(product.title)} />
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
