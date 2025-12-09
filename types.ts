export interface Product {
  id: string;
  name: string;
  category: 'Water Filters' | 'Solar Coolers' | 'Solar Panels' | 'Filter Components' | 'Industrial RO Plants' | string;
  price: number;
  description: string;
  features: string[];
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Processing' | 'Cancelled';
  date: string;
}

export interface AdminStats {
  totalRevenue: number;
  activeOrders: number;
  productsInStock: number;
  customerSatisfaction: number;
}

export interface AIRecommendation {
  productIds: string[];
  reasoning: string;
}