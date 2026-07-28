import type { ImageSourcePropType } from 'react-native';

export type ProductAssetSet = {
  hero: ImageSourcePropType;
  gallery: ImageSourcePropType[];
};

export type FeaturedPromo = {
  id: string;
  title: string;
  subtitle: string;
  eyebrow: string;
  cta: string;
  productId: string;
  image: ImageSourcePropType;
};

const image13 = require('@/assets/images/image 13.png');
const image1 = require('@/assets/images/image 1.png');
const image4 = require('@/assets/images/image 4.png');
const image4b = require('@/assets/images/image 4 (1).png');
const image5 = require('@/assets/images/image 5.png');
const image6 = require('@/assets/images/image 6.png');
const image8 = require('@/assets/images/image 8.png');
const image16 = require('@/assets/images/image 16.png');
const image17 = require('@/assets/images/image 17 (1).png');
const image19 = require('@/assets/images/image 19.png');
const image21 = require('@/assets/images/image 21 (1).png');
const image22 = require('@/assets/images/image 22.png');
const basicCard = require('@/assets/images/Basic Card.png');
const vCard = require('@/assets/images/V Card.png');
const promoPikachu = require('@/assets/images/image 2.png');
const promoCubone = require('@/assets/images/image 3.png');
const cardCollage = require('@/assets/images/image 4.png');
const mascotCharizard = require('@/assets/images/1aa6febd88204d4eb7ff8592ed65a6c0 1 (1).png');

export const PRODUCT_ASSETS: Record<string, ProductAssetSet> = {
  '1': {
    hero: image13,
    gallery: [image13, promoPikachu, image17],
  },
  '2': {
    hero: image1,
    gallery: [image1, mascotCharizard, image21],
  },
  '3': {
    hero: cardCollage,
    gallery: [cardCollage, image4b, basicCard],
  },
  '4': {
    hero: vCard,
    gallery: [vCard, basicCard, promoCubone],
  },
};

export const FEATURED_PROMOS: FeaturedPromo[] = [
  {
    id: 'featured-1',
    title: 'Pikachu Forest Spotlight',
    subtitle: 'A bright promo panel that opens the Pikachu card detail with one tap.',
    eyebrow: 'Featured Pokémon',
    cta: 'View Pikachu',
    productId: '1',
    image: promoPikachu,
  },
  {
    id: 'featured-2',
    title: 'Charizard Fire Rare',
    subtitle: 'Built for collectors who want the loudest card in the cabinet.',
    eyebrow: 'Featured Pokémon',
    cta: 'View Charizard',
    productId: '2',
    image: mascotCharizard,
  },
  {
    id: 'featured-3',
    title: 'Booster Collection Mix',
    subtitle: 'A wider showcase for sealed product, packs, and deck-style items.',
    eyebrow: 'Featured Pokémon',
    cta: 'Open Collection',
    productId: '3',
    image: cardCollage,
  },
];

export const HOME_BADGE = image8;
export const HOME_MASCOT = image16;
export const HOME_SECONDARY = image5;
export const HOME_SHOWCASE = image6;
export const PRODUCT_IMAGE_FALLBACK = basicCard;
