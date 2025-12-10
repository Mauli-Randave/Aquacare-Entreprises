import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Users, DollarSign, Activity, Sparkles, Plus, Edit2, Trash, ShieldAlert, Lock, LogOut, ChevronDown, User, Droplets, Filter, Save, X, Image as ImageIcon, Menu, ArrowRight, CheckCircle, Link as LinkIcon, AlertCircle, UploadCloud, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { MOCK_ORDERS, CATEGORIES } from '../constants';
import { generateProductDescription } from '../services/geminiService';
import { productService } from '../services/productService';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

// Pre-defined static images
const STOCK_IMAGES = [
  { name: 'RO Filter', url: 'https://images.unsplash.com/photo-1581093458791-9f302e68383e?auto=format&fit=crop&w=400&q=80' },
  { name: 'Water Cooler', url: 'https://images.unsplash.com/photo-1546552356-3fae876a61ca?auto=format&fit=crop&w=400&q=80' },
  { name: 'Solar Panel', url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=400&q=80' },
  { name: 'Components', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80' },
  { name: 'Industrial', url: 'https://images.unsplash.com/photo-1563950708942-db5d9dcca7a7?auto=format&fit=crop&w=400&q=80' },
  { name: 'Softener', url: 'https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?auto=format&fit=crop&w=400&q=80' },
  { name: 'Tech', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=400&q=80' },
  { name: 'Lab', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80' }
];

const DEFAULT_IMAGE_URL = STOCK_IMAGES[0].url;

// Mock Chart Data - Updated for INR magnitude
const SALES_DATA = [
  { name: 'Mon', sales: 45000 },
  { name: 'Tue', sales: 32000 },
  { name: 'Wed', sales: 28000 },
  { name: 'Thu', sales: 55000 },
  { name: 'Fri', sales: 42000 },
  { name: 'Sat', sales: 75000 },
  { name: 'Sun', sales: 82000 },
];

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();
  
  // Refs for auto-focus
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success'|'error'}>({
    show: false, message: '', type: 'success'
  });
  
  const { products, loading: productsLoading, addProduct, updateProduct, deleteProduct } = useProducts();

  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [inputType, setInputType] = useState<'file' | 'select' | 'url'>('select');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [deleteConfirm, setDeleteConfirm] = useState<{isOpen: boolean, id: string | null}>({ isOpen: false, id: null });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', category: 'Water Filters', price: 0, stock: 0, description: '', image: DEFAULT_IMAGE_URL, features: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState('');

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_session');
    if (auth === 'true') setIsAuthenticated(true);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === '123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_session', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Please try again.');
    }
  };
  
  // Handle Enter key on username to focus password
  const handleUsernameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      passwordInputRef.current?.focus();
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_session');
    setUsername('');
    setPassword('');
    navigate('/');
    setShowLogoutConfirm(false); 
  };

  const handleEditClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation(); 
    setFormData(product);
    setCurrentProductId(product.id);
    setIsEditing(true);
    setShowProductForm(true);
    
    const isStock = STOCK_IMAGES.some(img => img.url === product.image);
    if (isStock) {
        setInputType('select');
    } else if (product.image && product.image.includes('data:image')) {
        setInputType('file');
    } else {
        setInputType('url');
    }
  };

  const handleAddClick = () => {
    setFormData({
      name: '', category: 'Water Filters', price: 0, stock: 0, description: '', image: DEFAULT_IMAGE_URL, features: [], rating: 5, reviews: 0
    });
    setCurrentProductId(null);
    setIsEditing(false);
    setShowProductForm(true);
    setGeneratedDesc('');
    setInputType('select');
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.id;
    if (!id) return;
    
    setDeleteConfirm({ isOpen: false, id: null });
    setDeletingId(id);
    
    try {
      await deleteProduct(id);
      showNotification('Product deleted successfully', 'success');
    } catch (error: any) {
      console.error("Delete error:", error);
      showNotification(error.message || "Failed to delete product", 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
        alert("File too large. Please use an image under 2MB.");
        return;
    }
    setUploadingImage(true);
    try {
        const base64Url = await productService.uploadImage(file);
        setFormData(prev => ({ ...prev, image: base64Url }));
    } catch (error: any) {
        console.error("Upload failed:", error);
        alert("Image upload failed. Using placeholder.");
        setFormData(prev => ({ ...prev, image: DEFAULT_IMAGE_URL }));
    } finally {
        setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSave = {
        ...formData,
        image: formData.image || DEFAULT_IMAGE_URL,
        price: Number(formData.price),
        stock: Number(formData.stock),
    };
    try {
      if (isEditing && currentProductId) {
        await updateProduct(currentProductId, dataToSave);
        showNotification('Product updated successfully!', 'success');
      } else {
        await addProduct(dataToSave as Product);
        showNotification('Product added successfully!', 'success');
      }
      setShowProductForm(false);
    } catch (error: any) {
      console.error("Error saving product:", error);
      showNotification(`Error: ${error.message || 'Unknown error'}`, 'error');
    }
  };

  const handleGenerateDesc = async () => {
    if (!formData.name || !formData.category) {
        alert("Please enter a name and category first.");
        return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category || '');
    setGeneratedDesc(desc);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Real Tech Background Image */}
        <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" 
              alt="Technology Background" 
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
        </div>

        <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/50 p-8 border border-white/10 relative z-10">
          <div className="text-center mb-10">
             <div className="flex items-center justify-center gap-2 mb-6">
                <div className="relative p-3 bg-white/5 rounded-2xl border border-white/10 shadow-glow">
                  <Filter className="h-10 w-10 text-cyan-400" />
                  <Droplets className="h-5 w-5 text-blue-400 absolute bottom-1 right-1 animate-pulse" />
                </div>
             </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 mt-2 text-sm">Secure access for Aquacare Enterprises</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl flex items-center gap-3 animate-fade-in">
                <ShieldAlert size={18} className="flex-shrink-0" />
                {authError}
              </div>
            )}
            
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  onKeyDown={handleUsernameKeyDown}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-glow outline-none transition-all" 
                  placeholder="Enter admin ID" 
                  autoFocus
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  ref={passwordInputRef}
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder:text-slate-600 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:shadow-glow outline-none transition-all" 
                  placeholder="••••••••" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-white transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-bold text-sm tracking-wide hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Authenticate
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-600 font-mono">System v2.5 • Secure Connection</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white font-sans transition-colors duration-300">
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white font-medium animate-slide-up z-[100] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
           {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
           {toast.message}
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/40 z-[70] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center border border-white/20">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <LogOut size={24} />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Admin Logout</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to end your secure admin session?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <Trash size={24} />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 mb-2">Delete Product?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirm({ isOpen: false, id: null })}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-slate-900 text-white z-20 flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-2"><Filter className="h-6 w-6 text-cyan-400" /><span className="font-bold text-lg">AQUACARE ADMIN</span></div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg"><Menu size={24} /></button>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-30 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 mt-14 lg:mt-0">
          <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
             <div className="relative flex-shrink-0">
               <Filter className="h-8 w-8 text-cyan-400 group-hover:text-white transition-colors" />
               <Droplets className="h-4 w-4 text-white absolute bottom-0 right-0 animate-pulse" />
             </div>
             <div><h1 className="text-xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider">AQUACARE</h1><span className="text-[10px] uppercase tracking-[0.2em] text-cyan-500 block">Enterprise</span></div>
          </Link>
          <nav className="space-y-2">
            <button onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'overview' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-600/20' : 'hover:bg-slate-800 hover:text-white'}`}><Activity size={20} /> Overview</button>
            <button onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'products' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-600/20' : 'hover:bg-slate-800 hover:text-white'}`}><Package size={20} /> Products</button>
            <button onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'orders' ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-600/20' : 'hover:bg-slate-800 hover:text-white'}`}><Users size={20} /> Orders</button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800">
            {/* Navigates to Website */}
            <Link to="/" className="flex items-center gap-2 px-2 py-2 text-slate-400 text-sm hover:text-white transition-colors mb-2">
                <ArrowLeft size={16} /> Back to Website
            </Link>
            <div className="flex items-center gap-2 px-2 py-2 text-slate-400 text-sm"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 lg:p-8 pt-20 lg:pt-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h1 className="text-2xl font-display font-bold text-slate-900 capitalize">{activeTab} Dashboard</h1><p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p></div>
          <div className="flex items-center gap-6">
             <div className="relative" ref={profileMenuRef}>
               <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 hover:bg-slate-100 p-1 pr-2 rounded-full transition-colors focus:outline-none"><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/30">SA</div><ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} /></button>
               {isProfileMenuOpen && (
                 <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-50">
                   <div className="p-4 border-b border-slate-50 bg-slate-50"><p className="text-sm font-bold text-slate-900">Signed in as</p><p className="text-xs text-slate-500 truncate">admin@aquacare.com</p></div>
                   <div className="p-2"><Link to="/" className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors"><ArrowRight size={16} className="text-slate-400" /> Go to Website</Link></div>
                   <div className="border-t border-slate-50 p-2"><button onClick={handleLogoutClick} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors font-medium"><LogOut size={16} /> Sign Out</button></div>
                 </div>
               )}
             </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
                  <div className="relative z-10"><h3 className="font-bold font-display text-2xl mb-2">Product Management</h3><p className="text-slate-400 text-sm mb-8 max-w-xs">Full control over your inventory. Add, edit, or remove products instantly.</p><div className="flex gap-3"><button onClick={() => { setActiveTab('products'); handleAddClick(); }} className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20"><Plus size={18} /> Add New</button><button onClick={() => setActiveTab('products')} className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 backdrop-blur-sm">View All <ArrowRight size={18} /></button></div></div>
                  <Package className="absolute -right-6 -bottom-6 text-white/5 w-48 h-48 group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-center"><h3 className="font-bold font-display text-slate-900 mb-6 text-xl">System Health</h3><div className="space-y-6"><div className="flex justify-between items-center text-sm p-4 bg-slate-50 rounded-2xl"><span className="text-slate-500 flex items-center gap-3 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div> Database Connection</span><span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">Active</span></div><div className="flex justify-between items-center text-sm p-4 bg-slate-50 rounded-2xl"><span className="text-slate-500 flex items-center gap-3 font-medium"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div> AI Engine</span><span className="font-bold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">Ready</span></div></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{ label: 'Total Revenue', value: '₹28,45,231', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' }, { label: 'Total Products', value: products.length, icon: Package, color: 'text-cyan-600', bg: 'bg-cyan-50' }, { label: 'Customers', value: '2,345', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }, { label: 'AI Requests', value: '892', icon: Sparkles, color: 'text-solar-600', bg: 'bg-orange-50' }].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300"><div className="flex justify-between items-start mb-4"><div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div><span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">+12%</span></div><div className="text-slate-500 text-sm font-medium ml-1">{stat.label}</div><div className="text-2xl font-display font-extrabold text-slate-900 mt-1 ml-1">{stat.value}</div></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"><h3 className="font-bold font-display text-slate-900 mb-8 flex items-center gap-3 text-lg"><DollarSign size={24} className="text-cyan-600 bg-cyan-50 p-1 rounded-lg" /> Weekly Sales Performance</h3><div style={{ width: '100%', height: 320 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={SALES_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} /><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value/1000}k`} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} /><Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }} cursor={{ fill: '#f8fafc' }} /><Bar dataKey="sales" fill="#06b6d4" radius={[8, 8, 0, 0]} barSize={40} /></BarChart></ResponsiveContainer></div></div>
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"><h3 className="font-bold font-display text-slate-900 mb-8 flex items-center gap-3 text-lg"><Users size={24} className="text-solar-600 bg-orange-50 p-1 rounded-lg" /> Customer Growth Trend</h3><div style={{ width: '100%', height: 320 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={SALES_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} /><Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', padding: '12px' }} /><Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} /></LineChart></ResponsiveContainer></div></div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center">
                <div><h2 className="text-2xl font-display font-bold text-slate-900">Inventory Management</h2><p className="text-slate-500 mt-1">Manage your product catalog, prices, and stock.</p></div>
                <div className="flex gap-3">
                    {/* Back to Dashboard Button (Navigates within Admin) */}
                    <button 
                        onClick={() => setActiveTab('overview')} 
                        className="border border-slate-300 text-slate-600 px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-white hover:shadow-md transition-all"
                    >
                        <ArrowLeft size={18} /> Back to Dashboard
                    </button>
                    <button onClick={handleAddClick} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-slate-900/20"><Plus size={18} /> Add New Product</button>
                </div>
            </div>

            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-display font-bold text-slate-900 flex items-center gap-2">{isEditing ? <Edit2 size={20} className="text-cyan-600" /> : <Plus size={20} className="text-cyan-600" />}{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-900 bg-slate-50 p-2 rounded-full transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-8 space-y-6">
                    {!isEditing && (
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 p-24 bg-cyan-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10"><div className="flex items-center gap-2 mb-2 text-cyan-400 font-bold text-sm uppercase tracking-wider"><Sparkles size={16} /> AI Assistant</div><p className="text-sm text-slate-300 mb-4">Enter a Name and Category, then let AI write the description.</p><button type="button" onClick={handleGenerateDesc} disabled={isGenerating} className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium">{isGenerating ? 'Generating...' : 'Generate AI Description'}</button></div>
                      </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className="block text-sm font-bold text-cyan-800 mb-1.5 ml-1">Product Name</label><input type="text" required className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                        <div><label className="block text-sm font-bold text-cyan-800 mb-1.5 ml-1">Category</label><select className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-medium" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{CATEGORIES.filter(c => c !== 'All').map(c => (<option key={c} value={c}>{c}</option>))}</select></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div><label className="block text-sm font-bold text-cyan-800 mb-1.5 ml-1">Price (₹)</label><input type="number" step="1" required className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-medium" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} /></div>
                        <div><label className="block text-sm font-bold text-cyan-800 mb-1.5 ml-1">Stock</label><input type="number" required className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-medium" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} /></div>
                      </div>
                      <div><label className="block text-sm font-bold text-cyan-800 mb-1.5 ml-1">Description</label><textarea rows={4} className="w-full px-4 py-3.5 rounded-xl bg-slate-50 border-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-medium" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                      
                      {/* Image Selection Tabs */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                             <label className="block text-sm font-bold text-cyan-800 ml-1">Product Image</label>
                             <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
                                <button type="button" onClick={() => setInputType('select')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${inputType === 'select' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Select</button>
                                <button type="button" onClick={() => setInputType('file')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${inputType === 'file' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Upload</button>
                                <button type="button" onClick={() => setInputType('url')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${inputType === 'url' ? 'bg-white text-cyan-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>URL</button>
                             </div>
                        </div>
                        {inputType === 'select' ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {STOCK_IMAGES.map((img, idx) => (
                                    <div key={idx} onClick={() => setFormData({...formData, image: img.url})} className={`cursor-pointer rounded-xl overflow-hidden border-2 relative group transition-all ${formData.image === img.url ? 'border-cyan-500 ring-4 ring-cyan-100' : 'border-transparent hover:border-slate-200'}`}>
                                        <div className="aspect-square bg-slate-100"><img src={img.url} className="w-full h-full object-cover" alt={img.name} /></div>
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white text-xs font-bold text-center px-1">{img.name}</span></div>
                                        {formData.image === img.url && (<div className="absolute top-2 right-2 bg-cyan-500 text-white rounded-full p-1 shadow-md"><CheckCircle size={14} /></div>)}
                                    </div>
                                ))}
                            </div>
                        ) : inputType === 'file' ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors relative group">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingImage} />
                                {uploadingImage ? (<div className="flex flex-col items-center justify-center py-4"><Loader2 className="animate-spin text-cyan-600 mb-2" size={32} /><span className="text-sm text-slate-500">Resizing & Uploading...</span></div>) : formData.image && formData.image.includes('data:image') ? (<div className="relative group"><img src={formData.image} alt="Preview" className="mx-auto h-48 object-contain rounded-lg shadow-md" /><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg pointer-events-none"><p className="text-white font-medium flex items-center gap-2"><UploadCloud size={20} /> Click to Change</p></div></div>) : (<div className="py-4"><div className="bg-cyan-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><UploadCloud className="text-cyan-600" size={40} /></div><p className="text-base font-bold text-slate-900">Click or Drag to Upload</p><p className="text-xs text-slate-500 mt-1">JPG, PNG (Max 2MB)</p></div>)}
                            </div>
                        ) : (
                            <div className="relative"><input type="text" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-400 outline-none transition-all font-medium" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg" /><LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />{formData.image && (<div className="mt-4 h-40 bg-slate-50 rounded-xl overflow-hidden border border-slate-100"><img src={formData.image} className="w-full h-full object-contain" alt="URL Preview" onError={(e) => (e.currentTarget.style.display = 'none')} /></div>)}</div>
                        )}
                      </div>

                      <div className="pt-6 flex gap-4">
                        <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={uploadingImage} className="flex-1 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-cyan-600 transition-colors shadow-lg shadow-slate-900/20 flex justify-center items-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"><Save size={18} /> {isEditing ? 'Save Changes' : 'Create Product'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr><th className="px-8 py-5 font-bold text-slate-700 text-sm">Product Name</th><th className="px-6 py-5 font-bold text-slate-700 text-sm">Category</th><th className="px-6 py-5 font-bold text-slate-700 text-sm">Price</th><th className="px-6 py-5 font-bold text-slate-700 text-sm">Stock</th><th className="px-8 py-5 font-bold text-slate-700 text-sm text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productsLoading ? (<tr><td colSpan={5} className="p-12 text-center text-slate-500 font-medium">Loading inventory...</td></tr>) : products.length === 0 ? (<tr><td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No products found. Add one to get started.</td></tr>) : (
                    products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-8 py-4"><div className="flex items-center gap-4"><img src={p.image} className="w-12 h-12 rounded-xl bg-slate-100 object-cover border border-slate-200" alt="" /><span className="font-bold text-slate-900">{p.name}</span></div></td>
                        <td className="px-6 py-4 text-slate-600"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">{p.category}</span></td>
                        <td className="px-6 py-4 text-slate-900 font-bold">₹{p.price.toLocaleString()}</td>
                        <td className="px-6 py-4"><div className="flex items-center gap-2"><div className={`w-2.5 h-2.5 rounded-full ${p.stock > 10 ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'} shadow-sm`}></div><span className={`text-sm font-bold ${p.stock > 10 ? 'text-green-700' : 'text-red-700'}`}>{p.stock} units</span></div></td>
                        <td className="px-8 py-4 text-right">
                          <button onClick={(e) => handleEditClick(e, p)} className="relative z-50 text-slate-400 hover:text-cyan-600 mr-3 p-2 hover:bg-cyan-50 rounded-xl transition-colors" type="button"><Edit2 size={18} /></button>
                          <button 
                            onClick={(e) => handleDeleteClick(e, p.id)} 
                            disabled={deletingId === p.id}
                            className={`relative z-50 text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors ${deletingId === p.id ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            type="button"
                          >
                             {deletingId === p.id ? <Loader2 size={18} className="animate-spin" /> : <Trash size={18} />}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto animate-fade-in"><table className="w-full text-left min-w-[800px]"><thead className="bg-slate-50/50 border-b border-slate-200"><tr><th className="px-8 py-5 font-bold text-slate-700 text-sm">Order ID</th><th className="px-6 py-5 font-bold text-slate-700 text-sm">Customer</th><th className="px-6 py-5 font-bold text-slate-700 text-sm">Date</th><th className="px-6 py-5 font-bold text-slate-700 text-sm">Status</th><th className="px-8 py-5 font-bold text-slate-700 text-sm text-right">Total</th></tr></thead><tbody className="divide-y divide-slate-100">{MOCK_ORDERS.map(order => (<tr key={order.id} className="hover:bg-slate-50/80 transition-colors"><td className="px-8 py-4 font-mono text-sm text-slate-600 font-bold">#{order.id}</td><td className="px-6 py-4 text-slate-900 font-bold"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-black">{order.customerName.charAt(0)}</div>{order.customerName}</div></td><td className="px-6 py-4 text-slate-500 text-sm font-medium">{order.date}</td><td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{order.status}</span></td><td className="px-8 py-4 text-right font-black text-slate-900">₹{order.total.toLocaleString()}</td></tr>))}</tbody></table></div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;