import { Product, Order } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'AquaPure RO Advanced',
    category: 'Water Filters',
    price: 14999,
    description: 'Advanced Reverse Osmosis filtration system for pure, mineral-rich drinking water. Removes 99.9% of contaminants.',
    features: ['7-Stage Filtration', 'Mineralizer Technology', 'Smart LED Display', '20L Storage'],
    image: 'https://images.unsplash.com/photo-1581093458791-9f302e68383e?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 124,
    stock: 45
  },
  {
    id: 'p2',
    name: 'SolarFreeze 500',
    category: 'Solar Coolers',
    price: 45000,
    description: 'High-efficiency solar-powered air cooler. Perfect for off-grid living and eco-conscious homes.',
    features: ['Zero Electricity Bill', 'Silent Operation', 'Turbo Cooling Mode', 'Battery Backup Included'],
    image: 'https://images.unsplash.com/photo-1546552356-3fae876a61ca?auto=format&fit=crop&w=400&q=80',
    rating: 4.6,
    reviews: 89,
    stock: 12
  },
  {
    id: 'p3',
    name: 'SunMax 450W Panel',
    category: 'Solar Panels',
    price: 12500,
    description: 'Monocrystalline solar panel with 22% efficiency. Durable, weather-resistant, and high output.',
    features: ['High Efficiency Cells', 'Anti-Reflective Coating', '25-Year Warranty', 'Easy Installation'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80',
    rating: 4.9,
    reviews: 210,
    stock: 150
  },
  {
    id: 'p4',
    name: 'EcoFlow Water Softener',
    category: 'Water Filters',
    price: 7999,
    description: 'Whole-house water softener to prevent scale buildup and protect your appliances.',
    features: ['Salt-Free Tech', 'Compact Design', 'No Maintenance', 'Eco-Friendly'],
    image: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&w=400&q=80',
    rating: 4.3,
    reviews: 56,
    stock: 30
  },
  {
    id: 'p5',
    name: 'DesertStorm Solar AC',
    category: 'Solar Coolers',
    price: 65000,
    description: '1.5 Ton Solar Air Conditioner. Cools your home using the power of the sun.',
    features: ['Hybrid Solar/Grid', 'WiFi Control', 'Inverter Technology', 'Fast Cooling'],
    image: 'https://images.unsplash.com/photo-1563950708942-db5d9dcca7a7?auto=format&fit=crop&w=400&q=80',
    rating: 4.7,
    reviews: 42,
    stock: 8
  },
  {
    id: 'p6',
    name: 'SunPack Portable Kit',
    category: 'Solar Panels',
    price: 24999,
    description: 'Foldable portable solar panel kit for camping and RVs.',
    features: ['Foldable Design', 'USB Output', 'Lightweight', 'Waterproof'],
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 112,
    stock: 65
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Amit Sharma', total: 14999, status: 'Delivered', date: '2023-10-15' },
  { id: 'ORD-002', customerName: 'Priya Singh', total: 65000, status: 'Shipped', date: '2023-10-20' },
  { id: 'ORD-003', customerName: 'Rahul Verma', total: 7999, status: 'Pending', date: '2023-10-22' },
];

export const CATEGORIES = ['All', 'Water Filters', 'Solar Coolers', 'Solar Panels'];