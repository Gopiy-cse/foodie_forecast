import type { MenuItem } from '@/hooks/use-cart';
import { Leaf, Drumstick, GlassWater, Cake, UtensilsCrossed } from 'lucide-react';

export interface Hotel {
  id: string;
  name: string;
  cuisine: string;
  image: string;
  'data-ai-hint'?: string;
  menu: MenuItem[];
}

export const categories = [
  { name: 'Veg', icon: Leaf },
  { name: 'Non-Veg', icon: Drumstick },
  { name: 'Beverages', icon: GlassWater },
  { name: 'Desserts', icon: Cake },
];

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Butter Masala',
    price: 14.5,
    rating: 4.8,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'North Indian',
    category: 'Veg',
    'data-ai-hint': 'indian food',
  },
  {
    id: '2',
    name: 'Chicken Biryani',
    price: 18.0,
    rating: 4.9,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'Mughlai',
    category: 'Non-Veg',
    'data-ai-hint': 'biryani rice',
  },
  {
    id: '3',
    name: 'Masala Dosa',
    price: 10.0,
    rating: 4.7,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'South Indian',
    category: 'Veg',
    'data-ai-hint': 'indian dosa',
  },
  {
    id: '4',
    name: 'Fresh Lime Soda',
    price: 5.0,
    rating: 4.5,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'Beverage',
    category: 'Beverages',
    'data-ai-hint': 'lime drink',
  },
  {
    id: '5',
    name: 'Gulab Jamun',
    price: 6.0,
    rating: 4.8,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'Dessert',
    category: 'Desserts',
    'data-ai-hint': 'indian dessert',
  },
  {
    id: '6',
    name: 'Margherita Pizza',
    price: 12.99,
    rating: 4.5,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'Italian',
    category: 'Veg',
    'data-ai-hint': 'pizza margherita',
  },
  {
    id: '7',
    name: 'Spaghetti Carbonara',
    price: 15.5,
    rating: 4.6,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'Italian',
    category: 'Non-Veg',
    'data-ai-hint': 'pasta carbonara',
  },
  {
    id: '8',
    name: 'Chocolate Lava Cake',
    price: 8.5,
    rating: 4.9,
    image: 'https://placehold.co/600x400.png',
    cuisine: 'Dessert',
    category: 'Desserts',
    'data-ai-hint': 'chocolate cake',
  },
];

export const hotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'The Grand Indian',
    cuisine: 'North Indian, Mughlai',
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'indian restaurant',
    menu: [menuItems[0], menuItems[1], menuItems[3], menuItems[4]],
  },
  {
    id: 'hotel-2',
    name: 'Italiano\'s',
    cuisine: 'Italian',
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'italian restaurant',
    menu: [menuItems[5], menuItems[6], menuItems[7]],
  },
  {
    id: 'hotel-3',
    name: 'South Spice',
    cuisine: 'South Indian',
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'south indian restaurant',
    menu: [menuItems[2], menuItems[3]],
  },
    {
    id: 'hotel-4',
    name: 'Global Bites',
    cuisine: 'Multi-Cuisine',
    image: 'https://placehold.co/600x400.png',
    'data-ai-hint': 'modern restaurant',
    menu: menuItems,
  },
];


export const offers = [
  {
    title: 'Monsoon Munchies',
    description: 'Get 20% off on all snacks when it rains in your city!',
    code: 'RAINY20',
  },
  {
    title: 'Summer Coolers',
    description: 'Buy 1 Juice, Get 1 Free (Valid from 12 PM to 5 PM).',
    code: 'BOGOCOOL',
  },
  {
    title: 'First Order Offer',
    description: 'Flat $5 off on orders above $20.',
    code: 'NEW5',
  },
];
