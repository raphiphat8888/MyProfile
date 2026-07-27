import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Header } from '@/components/common/Header';
import { AppColors, AppFonts } from '@/constants/Colors';
import { useProducts } from '@/hooks/use-products';

const prices: Record<string, number> = { '1': 35, '2': 145, '3': 28, '4': 49 };

export default function CartScreen() {
  const router = useRouter();
  const { products } = useProducts();
  const [quantities, setQuantities] = useState<Record<string, number>>(() => Object.fromEntries(products.slice(0, 2).map((product) => [product.id, 1])));
  const cartProducts = products.filter((product) => quantities[product.id] > 0);
  const subtotal = useMemo(() => cartProducts.reduce((sum, product) => sum + (prices[product.id] ?? 20) * quantities[product.id], 0), [cartProducts, quantities]);

  const changeQuantity = (id: string, amount: number) => setQuantities((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + amount) }));

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={AppColors.background} />
      <Header title="Trainer Bag" searchPlaceholder="Search your bag..." actionLabel="Profile" actionHref="/admin" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}><View><Text style={styles.eyebrow}>READY FOR CHECKOUT</Text><Text style={styles.title}>Trainer Bag</Text><Text style={styles.subtitle}>{cartProducts.length} unique cards saved for this order.</Text></View><View style={styles.bagIcon}><MaterialCommunityIcons name="shopping-outline" size={30} color={AppColors.primary} /></View></View>

        {cartProducts.length ? <View style={styles.cartGrid}>
          <View style={styles.items}>
            {cartProducts.map((product) => (
              <View key={product.id} style={styles.itemCard}>
                <View style={styles.imageFrame}><Image source={{ uri: product.image_url }} style={styles.image} contentFit="contain" /></View>
                <View style={styles.itemCopy}><Text style={styles.category}>{product.category.toUpperCase()}</Text><Text style={styles.itemName}>{product.name}</Text><Text style={styles.condition}>Near Mint · ${Number(prices[product.id] ?? 20).toFixed(2)}</Text><View style={styles.quantity}><Pressable onPress={() => changeQuantity(product.id, -1)} style={styles.quantityButton}><MaterialCommunityIcons name="minus" size={17} color={AppColors.text} /></Pressable><Text style={styles.quantityText}>{quantities[product.id]}</Text><Pressable onPress={() => changeQuantity(product.id, 1)} style={styles.quantityButton}><MaterialCommunityIcons name="plus" size={17} color={AppColors.text} /></Pressable></View></View>
                <Text style={styles.linePrice}>${((prices[product.id] ?? 20) * quantities[product.id]).toFixed(2)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.summary}><Text style={styles.summaryTitle}>Order Summary</Text><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text></View><View style={styles.summaryRow}><Text style={styles.summaryLabel}>Shipping</Text><Text style={styles.free}>FREE</Text></View><View style={styles.rule} /><View style={styles.summaryRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.total}>${subtotal.toFixed(2)}</Text></View><Button label="Continue to Checkout" onPress={() => {}} /><Pressable onPress={() => router.push('/')}><Text style={styles.continue}>Continue shopping</Text></Pressable></View>
        </View> : <View style={styles.empty}><View style={styles.emptyIcon}><MaterialCommunityIcons name="shopping-outline" size={42} color={AppColors.primary} /></View><Text style={styles.emptyTitle}>Your trainer bag is empty</Text><Text style={styles.emptyText}>Add a card from the Shop to start your collection.</Text><Button label="Browse Cards" onPress={() => router.push('/')} /></View>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: AppColors.background, flex: 1 },
  content: { alignSelf: 'center', maxWidth: 1080, padding: 24, paddingBottom: 50, width: '100%' },
  heading: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 34, flexDirection: 'row', justifyContent: 'space-between', padding: 28 },
  eyebrow: { color: AppColors.accent, fontFamily: AppFonts.bodyExtraBold, fontSize: 9, letterSpacing: 1.2 },
  title: { color: AppColors.text, fontFamily: AppFonts.display, fontSize: 36, letterSpacing: -0.9, marginTop: 4 },
  subtitle: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 13, marginTop: 4 },
  bagIcon: { alignItems: 'center', backgroundColor: AppColors.yellow, borderRadius: 30, height: 60, justifyContent: 'center', width: 60 },
  cartGrid: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: 22, marginTop: 28 },
  items: { flex: 2, gap: 16, minWidth: 290 },
  itemCard: { alignItems: 'center', backgroundColor: '#FFFFFF', borderColor: '#DDE2F3', borderRadius: 28, borderWidth: 1, flexDirection: 'row', gap: 16, padding: 16 },
  imageFrame: { alignItems: 'center', backgroundColor: AppColors.backgroundAlt, borderRadius: 20, height: 112, justifyContent: 'center', width: 100 },
  image: { height: 96, width: 72 },
  itemCopy: { flex: 1 },
  category: { color: AppColors.accent, fontFamily: AppFonts.bodyExtraBold, fontSize: 8, letterSpacing: 1 },
  itemName: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 19, marginTop: 4 },
  condition: { color: AppColors.mutedText, fontFamily: AppFonts.bodyMedium, fontSize: 10, marginTop: 4 },
  quantity: { alignItems: 'center', flexDirection: 'row', gap: 12, marginTop: 12 },
  quantityButton: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 16, height: 32, justifyContent: 'center', width: 32 },
  quantityText: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 13 },
  linePrice: { color: AppColors.primary, fontFamily: AppFonts.bodyBold, fontSize: 17 },
  summary: { backgroundColor: '#FFFFFF', borderRadius: 28, flex: 1, gap: 17, minWidth: 280, padding: 24, shadowColor: '#24325A', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  summaryTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 24 },
  summaryRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 13 },
  summaryValue: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 14 },
  free: { color: AppColors.accent, fontFamily: AppFonts.bodyBold, fontSize: 12 },
  rule: { backgroundColor: '#E3E8F9', height: 1 },
  totalLabel: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 16 },
  total: { color: AppColors.primary, fontFamily: AppFonts.displayBold, fontSize: 24 },
  continue: { color: AppColors.accent, fontFamily: AppFonts.bodyBold, fontSize: 12, textAlign: 'center' },
  empty: { alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 34, gap: 10, marginTop: 30, padding: 42 },
  emptyIcon: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 38, height: 76, justifyContent: 'center', width: 76 },
  emptyTitle: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 25 },
  emptyText: { color: AppColors.mutedText, fontFamily: AppFonts.body, fontSize: 13, marginBottom: 10, textAlign: 'center' },
});
