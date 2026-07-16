import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { AppColors, AppRadius } from '@/constants/Colors';
import type { Product } from '@/types/product';

type ProjectCardProps = {
  product: Product;
};

export function ProjectCard({ product }: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isLowStock = product.badge_status === 'Low in stock';

  return (
    <Card style={styles.card}>
      <View style={styles.imageFrame}>
        {!imageFailed ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            contentFit="contain"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.fallbackText}>{product.name.slice(0, 1)}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.heading}>
          <View style={styles.titleGroup}>
            <Text style={styles.eyebrow}>PRODUCT {product.id.padStart(2, '0')}</Text>
            <Text style={styles.title}>{product.name}</Text>
          </View>
          <View style={[styles.badge, isLowStock && styles.badgeLow]}>
            <View style={[styles.badgeDot, isLowStock && styles.badgeDotLow]} />
            <Text style={[styles.badgeText, isLowStock && styles.badgeTextLow]}>
              {product.badge_status}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="archive-outline" size={18} color={AppColors.primary} />
            <View>
              <Text style={styles.detailLabel}>Stock</Text>
              <Text style={styles.detailValue}>{product.stock_text}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="shape-outline" size={18} color={AppColors.primary} />
            <View>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{product.category}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="store-outline" size={18} color={AppColors.primary} />
            <View>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{product.location_text}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    padding: 16,
  },
  imageFrame: {
    alignItems: 'center',
    backgroundColor: '#F2F5FA',
    borderColor: AppColors.border,
    borderRadius: AppRadius.control,
    borderWidth: 1,
    height: 132,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 132,
  },
  image: {
    height: 118,
    width: 84,
  },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: AppColors.softBlue,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  fallbackText: {
    color: AppColors.primary,
    fontSize: 42,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    gap: 18,
    minWidth: 240,
  },
  heading: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  titleGroup: {
    flex: 1,
    minWidth: 190,
  },
  eyebrow: {
    color: AppColors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: AppColors.text,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 26,
    marginTop: 5,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: AppColors.softMint,
    borderRadius: AppRadius.pill,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  badgeLow: {
    backgroundColor: '#FFF1DD',
  },
  badgeDot: {
    backgroundColor: AppColors.accent,
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  badgeDotLow: {
    backgroundColor: '#C56B16',
  },
  badgeText: {
    color: AppColors.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  badgeTextLow: {
    color: '#A95610',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    gap: 9,
    minWidth: 135,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  detailLabel: {
    color: AppColors.subtleText,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailValue: {
    color: AppColors.text,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 2,
  },
});
