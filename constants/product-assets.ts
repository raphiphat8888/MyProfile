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

export type PartnerPick = {
  id: string;
  name: string;
  label: string;
  filter: string;
  tint: string;
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
const backCard = require('@/assets/images/backcard-generated-v2.png');
const specialTaktjingFront = require('@/assets/images/special-taktjing-vmax-front.png');
const specialGoldBack = require('@/assets/images/special-gold-card-back-white-frame.png');
const promoPikachu = require('@/assets/images/image 2.png');
const promoCubone = require('@/assets/images/image 3.png');
const cardCollage = require('@/assets/images/image 4.png');
const mascotCharizard = require('@/assets/images/1aa6febd88204d4eb7ff8592ed65a6c0 1 (1).png');
const mascotBulbasaur = require('@/assets/images/bulbasaur_by_mutationfoxy_ddim750-fullview 1 (1).png');
const mascotBlastoise = require('@/assets/images/dewjemg-bd30c3ed-046a-487a-bf0c-17271409fb1d 1 (1).png');
const mascotPikachu = require('@/assets/images/image 17 (1).png');
const mascotSquirtle = require('@/assets/images/image 5.png');
const mascotCharmander = require('@/assets/images/image 6.png');

export const PRODUCT_ASSETS: Record<string, ProductAssetSet> = {
  '999': {
    hero: specialTaktjingFront,
    gallery: [specialTaktjingFront, specialGoldBack, specialTaktjingFront],
  },
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
    id: 'featured-taktjing-gold',
    title: 'Taktจัง Gold VMAX',
    subtitle: 'Ultra secret rare with a gold back and moving rainbow foil shimmer.',
    eyebrow: 'Ultra Secret Rare',
    cta: 'View Gold Card',
    productId: '999',
    image: specialTaktjingFront,
  },
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

export const PARTNER_PICKS: PartnerPick[] = [
  {
    id: 'partner-pikachu',
    name: 'Pikachu',
    label: 'Electric singles',
    filter: 'Single Card',
    tint: '#FFF4BA',
    image: mascotPikachu,
  },
  {
    id: 'partner-charmander',
    name: 'Charmander',
    label: 'Bundle hunt',
    filter: 'Bundle',
    tint: '#FFDAD6',
    image: mascotCharmander,
  },
  {
    id: 'partner-squirtle',
    name: 'Squirtle',
    label: 'Sealed shelf',
    filter: 'Sealed Pack',
    tint: '#DDF0FF',
    image: mascotSquirtle,
  },
  {
    id: 'partner-bulbasaur',
    name: 'Bulbasaur',
    label: 'Deck picks',
    filter: 'Deck',
    tint: '#DDFBD2',
    image: mascotBulbasaur,
  },
  {
    id: 'partner-blastoise',
    name: 'Blastoise',
    label: 'All inventory',
    filter: 'All Items',
    tint: '#E8EDFF',
    image: mascotBlastoise,
  },
  {
    id: 'partner-charizard',
    name: 'Charizard',
    label: 'Collector heat',
    filter: 'Single Card',
    tint: '#FFE1C7',
    image: mascotCharizard,
  },
];

export const HOME_BADGE = image8;
export const HOME_MASCOT = image16;
export const HOME_SECONDARY = image5;
export const HOME_SHOWCASE = image6;
export const PRODUCT_IMAGE_FALLBACK = basicCard;
export const BACK_CARD_IMAGE = backCard;
export const GOLD_BACK_CARD_IMAGE = specialGoldBack;
