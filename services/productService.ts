
import { supabase } from './supabaseClient';
import { Product } from '../types';

// Helper to resize image and convert to Base64 (Store directly in DB)
const fileToBase64 = (file: File, maxWidth: number = 400): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context not available'));

        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Return Base64 string (JPEG 70% quality)
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const productService = {
  // Fetch all products from Supabase (Strict Mode: No Mocks)
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Product[];
    } catch (error: any) {
      console.error("Supabase fetch failed:", error.message);
      return []; 
    }
  },

  // Create a new product
  async create(product: Omit<Product, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();
    
    if (error) throw new Error(error.message || "Failed to create product");
    return data as Product;
  },

  // Update an existing product
  async update(id: string, updates: Partial<Product>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message || "Failed to update product");
    return data as Product;
  },

  // Delete a product
  async delete(id: string) {
    // IMPORTANT: We request 'count' to detect if RLS silently blocked the delete
    const { error, count } = await supabase
      .from('products')
      .delete({ count: 'exact' }) 
      .eq('id', id);
    
    if (error) {
       // Check for Foreign Key Constraint (code 23503)
       if (error.code === '23503') {
           throw new Error("Cannot delete: Product is part of an existing Order. Please clear Orders first.");
       }
       throw new Error(error.message || "Failed to delete product");
    }

    // If no error but count is 0, it means permission denied (RLS) or ID not found
    if (count === 0) {
        throw new Error("Delete failed. Permission denied by database (Check RLS Policies) or product not found.");
    }
  },

  // Handle Image Upload (Converts to Base64 string for direct DB storage)
  async uploadImage(file: File): Promise<string> {
    try {
       const base64String = await fileToBase64(file);
       return base64String;
    } catch (error) {
       console.error("Image processing failed:", error);
       throw new Error("Failed to process image.");
    }
  }
};
