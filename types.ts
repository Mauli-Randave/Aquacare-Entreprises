export interface Product {
  id: string;
  name: string;
  category: 'Water Filters' | 'Solar Coolers' | 'Solar Panels';
  price: number;
  description: string;
  features: string[];
  image: string;
  rating: number;
  reviews: number;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
}

export interface AdminStats {
  totalRevenue: number;
  activeOrders: number;
  productsInStock: number;
  customerSatisfaction: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// Gemini specific types for our custom implementation
export interface AIRecommendation {
  productIds: string[];
  reasoning: string;
}