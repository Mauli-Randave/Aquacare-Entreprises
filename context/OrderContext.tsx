
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { MOCK_ORDERS } from '../constants';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateDeliveryDate: (id: string, date: string) => void;
  getOrdersByUserId: (userId: string) => Order[];
  stats: {
    revenue: number;
    totalOrders: number;
    activeOrders: number;
    totalCustomers: number;
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load from local storage or use mock
    const saved = localStorage.getItem('aquacare_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('aquacare_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateDeliveryDate = (id: string, date: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, deliveryDate: date } : o));
  };

  const getOrdersByUserId = (userId: string) => {
    return orders.filter(o => o.userId === userId);
  };

  // Calculate Stats
  const stats = {
    revenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
    totalCustomers: new Set(orders.map(o => o.customerEmail)).size
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updateDeliveryDate, getOrdersByUserId, stats }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
