import type { Profile } from '@/types/profile';

export const profile: Profile = {
  appName: 'Raphi Card Shop',
  name: 'Pokemon Card Market',
  role: 'Trading Card Store',
  initials: 'RC',
  intro:
    'Buy singles, booster packs, starter decks, and collector cards with clean photos, fair prices, and friendly service.',
  education: 'Pokemon card seller and collector',
  summary:
    'A small card shop for players and collectors who want authentic Pokemon cards, easy browsing, and quick contact before ordering.',
  location: 'Thailand',
  email: {
    label: 'Order Email',
    value: 'raphiphat.s@ku.th',
    href: 'mailto:raphiphat.s@ku.th',
  },
  github: {
    label: 'Card Catalog',
    value: 'github.com/raphiphat8888',
    href: 'https://github.com/raphiphat8888',
  },
  facebook: {
    label: 'Facebook Shop',
    value: 'facebook.com/raphiphat8888',
    href: 'https://facebook.com/raphiphat8888',
  },
  phone: {
    label: 'Phone / Line',
    value: 'Add order phone',
    href: 'tel:+66000000000',
  },
  projects: [
    {
      title: 'Pikachu Collector Card',
      description:
        'Popular electric-type card for collectors. Great for display binders and gift sets.',
      techStack: ['Single Card', 'Collector', 'Near Mint'],
      status: 'Hot',
      price: '350 THB',
      stock: 8,
      category: 'Single Card',
      imageUrl: 'https://images.pokemontcg.io/basep/1_hires.png',
    },
    {
      title: 'Charizard Fire Bundle',
      description:
        'Fire-type bundle with premium picks for players who like strong attack cards.',
      techStack: ['Bundle', 'Fire Type', 'Limited'],
      status: 'Rare',
      price: '1,490 THB',
      stock: 2,
      category: 'Bundle',
      imageUrl: 'https://images.pokemontcg.io/base4/4_hires.png',
    },
    {
      title: 'Booster Pack Set',
      description:
        'Sealed booster packs for opening, collecting, or starting a new deck build.',
      techStack: ['Sealed Pack', 'Random Pull', 'In Stock'],
      status: 'New',
      price: '180 THB',
      stock: 24,
      category: 'Sealed Pack',
      imageUrl: 'https://images.pokemontcg.io/swshp/SWSH050_hires.png',
    },
    {
      title: 'Starter Deck Box',
      description:
        'Ready-to-play deck set for beginners who want to start battling right away.',
      techStack: ['Starter Deck', 'Beginner', 'Ready Play'],
      status: 'Best Deal',
      price: '590 THB',
      stock: 5,
      category: 'Deck',
      imageUrl: 'https://images.pokemontcg.io/base1/2_hires.png',
    },
  ],
  skills: [
    {
      title: 'Single Cards',
      description: 'Individual cards for collectors and deck builders.',
      skills: ['Pikachu', 'Charizard', 'Trainer', 'Energy', 'Holo'],
    },
    {
      title: 'Sealed Products',
      description: 'Fresh packs and boxes for opening or keeping sealed.',
      skills: ['Booster Pack', 'Deck Box', 'Promo Pack', 'Gift Set'],
    },
    {
      title: 'Card Condition',
      description: 'Clear condition labels before every order.',
      skills: ['Near Mint', 'Light Play', 'Sleeved', 'Top Loader'],
    },
    {
      title: 'Shop Service',
      description: 'Friendly support for choosing cards and confirming stock.',
      skills: ['Stock Check', 'Card Photos', 'Order Chat', 'Delivery'],
    },
  ],
};
