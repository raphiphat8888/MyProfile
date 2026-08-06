import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Header } from '@/components/common/Header';
import { PatternBackground } from '@/components/common/PatternBackground';
import { SectionTitle } from '@/components/common/SectionTitle';
import { AppColors, AppFonts, AppSpacing } from '@/constants/Colors';
import { useAuth } from '@/hooks/use-auth';
import { useProducts } from '@/hooks/use-products';

const categoryOptions = ['Single Card', 'Bundle', 'Sealed Pack', 'Deck'];

export default function AddProductScreen() {
  const auth = useAuth();
  const { createProduct, refresh } = useProducts();
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Single Card');
  const [locationCount, setLocationCount] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaved(false);
    if (saving) {
      return;
    }
    if (!auth.isAdmin || !auth.token) {
      setError('Admin login is required before publishing to Cloud MySQL.');
      return;
    }
    if (!name.trim()) {
      setError('Give this product a name before preparing it.');
      return;
    }
    if (!stock.trim() || Number(stock) < 0 || !Number.isFinite(Number(stock))) {
      setError('Enter a valid stock number of 0 or more.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await createProduct({
        name: name.trim(),
        stock: Number(stock),
        category,
        location_count: Number(locationCount) || 0,
        image_url: imageUrl.trim(),
      }, auth.token);
      await refresh();
      setSaved(true);
      setName('');
      setStock('');
      setLocationCount('1');
      setImageUrl('');
      setCategory('Single Card');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Publish failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <PatternBackground />
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Add product" searchPlaceholder="Search before adding..." actionLabel="Products" actionHref="/chase-list" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SectionTitle eyebrow="Admin publishing" title="Add a card to Cloud MySQL" description="Only Store Officer accounts can publish new products to the live SQL catalog." />

        {!auth.isAdmin ? (
          <View style={styles.lockedCard}>
            <MaterialCommunityIcons name="shield-lock-outline" color={AppColors.primary} size={34} />
            <View style={styles.lockedCopy}>
              <Text style={styles.lockedTitle}>Store Officer login required</Text>
              <Text style={styles.lockedText}>Log in with an admin account from the Admin console before adding live products.</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.layout}>
          <Card style={styles.formCard}>
            <View style={styles.stepHeading}>
              <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
              <View><Text style={styles.stepTitle}>Card details</Text><Text style={styles.stepText}>Fields marked required keep the catalog tidy.</Text></View>
            </View>

            {error ? (
              <View style={styles.errorBanner}>
                <MaterialCommunityIcons name="alert-circle-outline" color={AppColors.text} size={20} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Product name *</Text>
              <TextInput accessibilityLabel="Product name" style={[styles.input, error && !name.trim() && styles.inputError]} value={name} onChangeText={setName} placeholder="Pikachu Collector Card" placeholderTextColor={AppColors.subtleText} />
            </View>

            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Stock *</Text>
                <TextInput accessibilityLabel="Stock" style={styles.input} value={stock} onChangeText={setStock} placeholder="8" placeholderTextColor={AppColors.subtleText} keyboardType="number-pad" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Store locations</Text>
                <TextInput accessibilityLabel="Store locations" style={styles.input} value={locationCount} onChangeText={setLocationCount} placeholder="1" placeholderTextColor={AppColors.subtleText} keyboardType="number-pad" />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryOptions}>
                {categoryOptions.map((option) => {
                  const selected = category === option;
                  return (
                    <Pressable key={option} onPress={() => setCategory(option)} style={({ pressed }) => [styles.categoryChip, selected && styles.categoryChipSelected, pressed && styles.pressed]}>
                      <Text style={styles.categoryChipText}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Product image URL</Text>
              <TextInput accessibilityLabel="Product image URL" autoCapitalize="none" style={styles.input} value={imageUrl} onChangeText={setImageUrl} placeholder="https://example.com/card.png" placeholderTextColor={AppColors.subtleText} />
              <Text style={styles.helpText}>Use a direct HTTPS image link for the best preview.</Text>
            </View>

            <View style={styles.actions}>
              <Button label={saving ? 'Publishing...' : 'Publish to SQL'} onPress={() => void handleSave()} />
              <Button label="View products" href="/chase-list" variant="secondary" />
            </View>

            {saved ? (
              <View style={styles.successBanner}>
                <MaterialCommunityIcons name="check-decagram-outline" color={AppColors.text} size={22} />
                <View style={styles.feedbackCopy}><Text style={styles.feedbackTitle}>Published to Cloud MySQL!</Text><Text style={styles.feedbackText}>The live catalog has been refreshed with the new product.</Text></View>
              </View>
            ) : null}
          </Card>

          <View style={styles.previewColumn}>
            <Card style={styles.previewCard}>
              <View style={styles.previewLabel}><MaterialCommunityIcons name="eye-outline" size={16} color={AppColors.text} /><Text style={styles.previewLabelText}>LIVE PREVIEW</Text></View>
              <View style={styles.previewFrame}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.previewImage} contentFit="contain" />
                ) : (
                  <MaterialCommunityIcons name="cards-outline" color={AppColors.text} size={64} />
                )}
              </View>
              <Text style={styles.previewCategory}>{category.toUpperCase()}</Text>
              <Text style={styles.previewName}>{name || 'Your card name'}</Text>
              <View style={styles.previewMeta}>
                <Text style={styles.previewMetaText}>{stock || '0'} in stock</Text>
                <Text style={styles.previewMetaText}>{locationCount || '0'} stores</Text>
              </View>
            </Card>
            <View style={styles.tipCard}>
              <MaterialCommunityIcons name="lightbulb-on-outline" color={AppColors.text} size={24} />
              <Text style={styles.tipText}>A clear product name and image make the shelf easier to scan.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 1080, padding: AppSpacing.pageX, paddingBottom: 36, width: '100%' },
  layout: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  lockedCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 24, borderWidth: 1, flexDirection: 'row', gap: 12, marginBottom: 18, padding: 16 },
  lockedCopy: { flex: 1 },
  lockedTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 18 },
  lockedText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 12, lineHeight: 18, marginTop: 3 },
  formCard: { backgroundColor: AppColors.softMint, flex: 2, gap: 15, minWidth: 300 },
  previewColumn: { flex: 1, gap: 16, minWidth: 270 },
  stepHeading: { alignItems: 'center', flexDirection: 'row', gap: 11, marginBottom: 2 },
  stepNumber: { alignItems: 'center', backgroundColor: AppColors.yellow, borderRadius: 21, height: 42, justifyContent: 'center', width: 42 },
  stepNumberText: { color: AppColors.text, fontSize: 18, fontWeight: '900' },
  stepTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 18 },
  stepText: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 10, marginTop: 2 },
  fieldGroup: { gap: 7 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  field: { flex: 1, gap: 7, minWidth: 150 },
  label: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 11 },
  input: { backgroundColor: '#FFFFFF', borderColor: '#D4DAEB', borderRadius: 16, borderWidth: 1, color: AppColors.text, fontFamily: AppFonts.bodyMedium, fontSize: 13, minHeight: 48, paddingHorizontal: 13 },
  inputError: { backgroundColor: '#FFF0F3', borderColor: '#D94766' },
  helpText: { color: AppColors.mutedText, fontSize: 10, fontWeight: '600' },
  categoryOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { backgroundColor: AppColors.softBlue, borderRadius: 999, minHeight: 38, justifyContent: 'center', paddingHorizontal: 12 },
  categoryChipSelected: { backgroundColor: AppColors.yellow, shadowColor: AppColors.yellow, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.24, shadowRadius: 10 },
  categoryChipText: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 10 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 5 },
  errorBanner: { alignItems: 'center', backgroundColor: '#FFE1E7', borderRadius: 12, flexDirection: 'row', gap: 9, padding: 11 },
  errorText: { color: AppColors.text, flex: 1, fontSize: 11, fontWeight: '800', lineHeight: 17 },
  successBanner: { alignItems: 'flex-start', backgroundColor: AppColors.softMint, borderRadius: 13, flexDirection: 'row', gap: 10, marginTop: 2, padding: 12 },
  feedbackCopy: { flex: 1 },
  feedbackTitle: { color: AppColors.text, fontSize: 13, fontWeight: '900' },
  feedbackText: { color: AppColors.mutedText, fontSize: 10, fontWeight: '700', lineHeight: 16, marginTop: 2 },
  previewCard: { backgroundColor: AppColors.softBlue },
  previewLabel: { alignItems: 'center', alignSelf: 'flex-start', backgroundColor: AppColors.yellow, borderRadius: 999, flexDirection: 'row', gap: 5, paddingHorizontal: 9, paddingVertical: 5 },
  previewLabelText: { color: AppColors.text, fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  previewFrame: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 20, borderWidth: 1, height: 190, justifyContent: 'center', marginTop: 15, overflow: 'hidden' },
  previewImage: { height: 174, width: '100%' },
  previewCategory: { color: AppColors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 0.9, marginTop: 15 },
  previewName: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 20, letterSpacing: -0.4, marginTop: 4 },
  previewMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 },
  previewMetaText: { backgroundColor: '#FFFFFF', borderColor: AppColors.text, borderRadius: 999, borderWidth: 1.5, color: AppColors.text, fontSize: 10, fontWeight: '900', overflow: 'hidden', paddingHorizontal: 9, paddingVertical: 5 },
  tipCard: { alignItems: 'center', backgroundColor: AppColors.peach, borderRadius: 20, flexDirection: 'row', gap: 10, padding: 13 },
  tipText: { color: AppColors.text, flex: 1, fontSize: 11, fontWeight: '800', lineHeight: 16 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.98 }] },
});
