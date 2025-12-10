import React, { createContext, useContext, useState, useEffect } from 'react';
// IMPORT 'Outlet' for the Layout Component to render children
import { HashRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { CartItem, Product } from './types';

// Component Imports (Assume these files now exist)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import About from './pages/About';

// Context Imports (Assume these files now exist)
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { ThemeProvider } from './context/ThemeContext';
import { OrderProvider } from './context/OrderContext';

// --- Cart Context Setup (Remains Correct) ---
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, qty: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

// --- ScrollToTop (Remains Correct) ---
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// --- NEW Layout Component for Public Pages ---
const PublicLayout: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Navbar />
            <main className="flex-grow">
                {/* Renders the child route component (Home, Shop, etc.) */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

// --- Main Application Component (App.tsx) ---
const App: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    // ... (Cart logic functions remain the same) ...
    const addToCart = (product: Product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => 
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, qty: number) => {
        const newQty = Math.max(1, qty); 
        setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, quantity: newQty } : item
        ));
    };

    const clearCart = () => setCartItems([]);


    return (
        <ThemeProvider>
            <AuthProvider>
                <ProductProvider>
                    <OrderProvider>
                        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
                            <Router>
                                
                                <Routes>
                                    
                                    {/* Routes without the Public Layout (Admin/Auth) */}
                                    <Route path="/admin" element={<AdminDashboard />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    
                                    {/* Parent Route with the Layout applied */}
                                    <Route path="/" element={<PublicLayout />}>
                                        {/* Child Routes (These render INSIDE the <Outlet /> in PublicLayout) */}
                                        <Route index element={<Home />} /> {/* Renders Home at the root path "/" */}
                                        <Route path="shop" element={<Shop />} />
                                        <Route path="product/:id" element={<ProductDetail />} />
                                        <Route path="cart" element={<Cart />} />
                                        <Route path="profile" element={<Profile />} />
                                        <Route path="about" element={<About />} />
                                        
                                        {/* Optional: 404/Catch-all inside the layout */}
                                        {/* <Route path="*" element={<NotFound />} /> */}
                                    </Route>
                                    
                                </Routes>
                                
                            </Router>
                        </CartContext.Provider>
                    </OrderProvider>
                </ProductProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;