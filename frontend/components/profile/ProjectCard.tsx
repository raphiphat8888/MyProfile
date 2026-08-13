import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors, AppFonts } from '@/constants/Colors';
import { PRODUCT_ASSETS, PRODUCT_IMAGE_FALLBACK } from '@/constants/product-assets';
import { useCart } from '@/hooks/use-cart';
import { useProfile } from '@/hooks/use-profile';
import type { Product } from '@/types/product';

type ProjectCardProps = { product: Product };

const prices: Record<string, number> = { '1': 35, '2': 145, '3': 28, '4': 49 };

export function ProjectCard({ product }: ProjectCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { profile } = useProfile();
  const [imageFailed, setImageFailed] = useState(false);
  const isFire = /fire|charizard/i.test(`${product.category} ${product.name}`);
  const price = product.price ?? prices[product.id] ?? Math.max(12, product.stock * 4);

  const imageSource = (!imageFailed && product.image_url && /^https?:\/\//i.test(product.image_url))
    ? { uri: product.image_url }
    : PRODUCT_ASSETS[product.id]?.hero ?? PRODUCT_IMAGE_FALLBACK;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}`}
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      {({ hovered }) => (
        <>
          <View style={[styles.imageArea, hovered && styles.imageAreaHovered]}>
            <View style={[styles.typePill, isFire ? styles.firePill : styles.electricPill]}>
              <MaterialCommunityIcons name={isFire ? 'fire' : 'lightning-bolt'} size={15} color={isFire ? AppColors.secondary : AppColors.text} />
              <Text style={[styles.typeText, isFire && styles.fireText]}>{isFire ? 'Fire' : 'Electric'}</Text>
            </View>
            {!imageFailed ? (
              <Image
                source={imageSource}
                style={styles.image}
                contentFit="contain"
                transition={180}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <MaterialCommunityIcons name="cards-playing-outline" size={54} color={AppColors.primary} />
            )}
          </View>

          <View style={styles.content}>
            <Text style={styles.category} numberOfLines={2}>{product.category} · {product.stock} IN STOCK</Text>
            <Text style={styles.title} numberOfLines={2}>{product.name}</Text>
            <View style={styles.footer}>
              <Text style={styles.price}>{profile.settings.currency} {price.toFixed(2)}</Text>
              <Pressable
                accessibilityLabel={`Add ${product.name} to cart`}
                onPress={(event) => {
                  event.stopPropagation();
                  addToCart(product.id);
                }}
                style={[styles.bagButton, isFire && styles.bagButtonFire]}>
                <MaterialCommunityIcons name="cart-plus" size={22} color={isFire ? AppColors.primary : AppColors.text} />
              </Pressable>
            </View>
          </View>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE2F3',
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    minHeight: 400,
    overflow: 'hidden',
    shadowColor: '#24325A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  imageArea: {
    alignItems: 'center',
    backgroundColor: AppColors.backgroundAlt,
    height: 250,
    justifyContent: 'center',
    padding: 18,
    position: 'relative',
    // @ts-ignore
    transitionProperty: 'transform',
    // @ts-ignore
    transitionDuration: '0.2s',
    // @ts-ignore
    transitionTimingFunction: 'ease-in-out',
  },
  imageAreaHovered: {
    transform: [{ scale: 1.05 }],
  },
  typePill: { alignItems: 'center', backgroundColor: AppColors.yellow, borderRadius: 999, flexDirection: 'row', gap: 4, left: 16, paddingHorizontal: 12, paddingVertical: 7, position: 'absolute', top: 16, zIndex: 2 },
  firePill: { backgroundColor: '#FFD3D1' },
  electricPill: { backgroundColor: AppColors.yellow },
  typeText: { color: AppColors.text, fontFamily: AppFonts.bodyBold, fontSize: 12 },
  fireText: { color: AppColors.secondary },
  image: { height: 190, marginTop: 22, width: '88%' },
  content: { flex: 1, padding: 20 },
  category: { color: AppColors.mutedText, fontFamily: AppFonts.bodyExtraBold, fontSize: 11, letterSpacing: 1, lineHeight: 16, textTransform: 'uppercase' },
  title: { color: AppColors.text, fontFamily: AppFonts.displayBold, fontSize: 23, letterSpacing: -0.5, lineHeight: 28, marginTop: 8 },
  footer: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between', marginTop: 'auto', paddingTop: 18 },
  price: { color: AppColors.primary, fontFamily: AppFonts.bodyExtraBold, fontSize: 21 },
  bagButton: { alignItems: 'center', backgroundColor: AppColors.softBlue, borderRadius: 24, height: 48, justifyContent: 'center', width: 48 },
  bagButtonFire: { backgroundColor: AppColors.yellow },
  pressed: { opacity: 0.86, transform: [{ scale: 0.985 }] },
});
