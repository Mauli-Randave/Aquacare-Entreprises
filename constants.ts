
import { Product, Order } from './types';

export const COMPANY_DETAILS = {
  name: "Aquacare Enterprises",
  adminName: "Tanaji Gavali",
  adminEmail: "tanajig@gmail.com",
  adminPhone: "7620643886",
  address: "Shop No-6, Plot No. 1/2, Sumurthi Prakash Tower Near Savaskar Hospital Old Hotgi Naka, Hotgi Rd, Solapur, Maharashtra 413003"
};

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
    image: 'https://cpimg.tistatic.com/05466436/b/4/Stainless-Steel-Water-Cooler.jpg',
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
    name: 'Industrial RO Plant 1000 LPH',
    category: 'Industrial RO Plants',
    price: 185000,
    description: 'Heavy-duty 1000 LPH Industrial RO Plant with stainless steel skid, high-pressure pump, and FRP vessels.',
    features: ['1000 Liters Per Hour', 'SS 304 Skid', 'Fully Automatic', 'TDS Controller'],
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Reverse_osmosis_desalination_plant.jpg',
    rating: 5.0,
    reviews: 12,
    stock: 5
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

// Initial mock orders if storage is empty
export const MOCK_ORDERS: Order[] = [
  { 
    id: 'ORD-001', 
    userId: 'mock-user-1',
    customerName: 'Amit Sharma', 
    customerEmail: 'amit@example.com',
    customerPhone: '9876543210',
    items: [],
    total: 14999, 
    status: 'Delivered', 
    date: '2023-10-15',
    deliveryDate: '2023-10-18',
    paymentMethod: 'UPI'
  },
];

export const CATEGORIES = ['All', 'Water Filters', 'Solar Coolers', 'Solar Panels', 'Industrial RO Plants'];
