
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { productService } from '../services/productService';
import { Product } from '../types';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Realtime Subscription
    const subscription = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        // Only refresh on INSERT or UPDATE. 
        // For DELETE, we handle it optimistically locally to avoid UI jitter.
        if (payload.eventType !== 'DELETE') {
            fetchProducts();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    await productService.create(product);
    await fetchProducts();
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    await productService.update(id, updates);
    await fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    // Optimistic Update: Remove from UI immediately
    const previousProducts = [...products];
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
        await productService.delete(id);
    } catch (err: any) {
        // Rollback if failed
        console.error("Delete failed, rolling back UI", err);
        setProducts(previousProducts);
        throw err; // Re-throw to let component show alert
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      loading, 
      error, 
      refreshProducts: fetchProducts,
      addProduct,
      updateProduct,
      deleteProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
