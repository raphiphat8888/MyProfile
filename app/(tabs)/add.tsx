import { useState } from 'react';
import { Image } from 'expo-image';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppColors, AppRadius, AppSpacing } from '@/constants/Colors';

export default function AddProductScreen() {
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [locationCount, setLocationCount] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Add Product" searchPlaceholder="Search products..." actionLabel="Products" actionHref="/projects" />
      <ScrollView style={styles.scroller} contentContainerStyle={styles.content}>
        <SectionTitle
          eyebrow="Admin"
          title="Add Pokemon card product"
          description="Prepare the product fields used by products.json: name, stock, category, store count, and image URL."
        />

        <Card style={styles.form}>
          <Text style={styles.label}>Product name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Pikachu Collector Card" />

          <View style={styles.row}>
            <View style={styles.field}>
              <Text style={styles.label}>Stock</Text>
              <TextInput style={styles.input} value={stock} onChangeText={setStock} placeholder="8" keyboardType="number-pad" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Store locations</Text>
              <TextInput
                style={styles.input}
                value={locationCount}
                onChangeText={setLocationCount}
                placeholder="3"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Category</Text>
          <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Single Card" />

          <Text style={styles.label}>Product image URL</Text>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="https://example.com/card-image.png"
          />

          <View style={styles.previewBox}>
            {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.previewImage} contentFit="contain" /> : null}
            <Text style={styles.previewLabel}>Image preview</Text>
            <Text style={styles.previewText}>{imageUrl || 'Paste an image URL to show it on product cards.'}</Text>
          </View>

          <View style={styles.actions}>
            <Button label="Prepare Product" onPress={handleSave} />
            <Button label="View Products" href="/projects" variant="secondary" />
          </View>

          {saved ? (
            <Text style={styles.notice}>
              Product draft prepared locally. Add it to products.json, then commit and push to publish it.
            </Text>
          ) : null}
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
    maxWidth: 860,
    padding: AppSpacing.pageX,
    paddingBottom: AppSpacing.pageBottom,
    width: '100%',
  },
  form: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  field: {
    flex: 1,
    minWidth: 180,
  },
  label: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F4F5F7',
    borderColor: AppColors.border,
    borderRadius: AppRadius.control,
    borderWidth: 1,
    color: AppColors.text,
    fontSize: 15,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  notice: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 12,
  },
  previewBox: {
    alignItems: 'center',
    backgroundColor: AppColors.softPurple,
    borderRadius: AppRadius.control,
    gap: 4,
    minHeight: 160,
    marginTop: 8,
    padding: 14,
  },
  previewImage: {
    height: 120,
    width: '100%',
  },
  previewLabel: {
    color: AppColors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  previewText: {
    color: AppColors.mutedText,
    fontSize: 13,
    lineHeight: 19,
  },
});
