import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Users, DollarSign, Activity, Sparkles, Plus, Edit2, Trash, ShieldAlert, Lock, LogOut, ChevronDown, User, Droplets, Filter, Save, X, Image as ImageIcon, Menu, ArrowRight, CheckCircle, Link as LinkIcon, AlertCircle, UploadCloud, Loader2 } from 'lucide-react';
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

// Mock Chart Data
const SALES_DATA = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 2000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_session');
    setUsername('');
    setPassword('');
    navigate('/'); 
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

  const handleDeleteClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this product?')) {
      setDeletingId(id);
      try {
        await deleteProduct(id);
        showNotification('Product deleted successfully', 'success');
      } catch (error: any) {
        console.error("Delete error:", error);
        // Using alert to ensure visibility if toast is missed
        alert(`Delete Failed: ${error.message}`);
        showNotification(error.message || "Failed to delete product", 'error');
      } finally {
        setDeletingId(null);
      }
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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
             <div className="flex items-center justify-center gap-2 mb-4">
                <div className="relative">
                  <Filter className="h-10 w-10 text-aqua-600" />
                  <Droplets className="h-5 w-5 text-aqua-400 absolute bottom-0 right-0" />
                </div>
             </div>
            <h1 className="text-2xl font-bold text-slate-900">AQUACARE</h1>
            <p className="text-slate-500 mt-1">Enterprise Admin Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <ShieldAlert size={16} />
                {authError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="Enter admin username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-4 pr-4 py-3 rounded-xl border border-slate-200 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-aqua-600 transition-colors shadow-lg">Access Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden relative">
      {toast.show && (
        <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 text-white font-medium animate-slide-up z-[100] ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
           {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
           {toast.message}
        </div>
      )}

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full bg-slate-900 text-white z-20 flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-2"><Filter className="h-6 w-6 text-aqua-400" /><span className="font-bold text-lg">AQUACARE ADMIN</span></div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg"><Menu size={24} /></button>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 flex flex-col z-30 shadow-2xl transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 mt-14 lg:mt-0">
          <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
             <div className="relative flex-shrink-0">
               <Filter className="h-8 w-8 text-aqua-400 group-hover:text-white transition-colors" />
               <Droplets className="h-4 w-4 text-white absolute bottom-0 right-0 animate-pulse" />
             </div>
             <div><h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider">AQUACARE</h1><span className="text-[10px] uppercase tracking-[0.2em] text-aqua-500 block">Enterprise</span></div>
          </Link>
          <nav className="space-y-2">
            <button onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'overview' ? 'bg-aqua-600/10 text-aqua-400 border border-aqua-600/20' : 'hover:bg-slate-800 hover:text-white'}`}><Activity size={20} /> Overview</button>
            <button onClick={() => { setActiveTab('products'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'products' ? 'bg-aqua-600/10 text-aqua-400 border border-aqua-600/20' : 'hover:bg-slate-800 hover:text-white'}`}><Package size={20} /> Products</button>
            <button onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'orders' ? 'bg-aqua-600/10 text-aqua-400 border border-aqua-600/20' : 'hover:bg-slate-800 hover:text-white'}`}><Users size={20} /> Orders</button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-800"><div className="flex items-center gap-2 px-2 py-2 text-slate-400 text-sm"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</div></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 lg:p-8 pt-20 lg:pt-8">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div><h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab} Dashboard</h1><p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p></div>
          <div className="flex items-center gap-6">
             <div className="relative" ref={profileMenuRef}>
               <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 hover:bg-slate-100 p-1 pr-2 rounded-full transition-colors focus:outline-none"><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-aqua-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-aqua-500/30">SA</div><ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} /></button>
               {isProfileMenuOpen && (
                 <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-50">
                   <div className="p-4 border-b border-slate-50 bg-slate-50"><p className="text-sm font-bold text-slate-900">Signed in as</p><p className="text-xs text-slate-500 truncate">admin@aquacare.com</p></div>
                   <div className="border-t border-slate-50 p-2"><button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors font-medium"><LogOut size={16} /> Sign Out</button></div>
                 </div>
               )}
             </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
                  <div className="relative z-10"><h3 className="font-bold text-xl mb-2">Product Management</h3><p className="text-slate-400 text-sm mb-6">Add, edit, or remove products from your catalog instantly.</p><div className="flex gap-3"><button onClick={() => { setActiveTab('products'); handleAddClick(); }} className="bg-aqua-500 hover:bg-aqua-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"><Plus size={18} /> Add New Product</button><button onClick={() => setActiveTab('products')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">View All <ArrowRight size={18} /></button></div></div>
                  <Package className="absolute right-4 bottom-4 text-white/5 w-24 h-24 group-hover:scale-110 transition-transform" />
               </div>
               <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-center"><h3 className="font-bold text-slate-900 mb-4">System Status</h3><div className="space-y-4"><div className="flex justify-between items-center text-sm"><span className="text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Database Connection</span><span className="font-medium text-slate-900">Active</span></div><div className="flex justify-between items-center text-sm"><span className="text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> AI Service</span><span className="font-medium text-slate-900">Ready</span></div></div></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{ label: 'Total Revenue', value: '$45,231.89', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' }, { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' }, { label: 'Customers', value: '2,345', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' }, { label: 'AI Requests', value: '892', icon: Sparkles, color: 'text-solar-600', bg: 'bg-orange-50' }].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"><div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><stat.icon size={24} /></div><span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span></div><div className="text-slate-500 text-sm font-medium">{stat.label}</div><div className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</div></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><DollarSign size={20} className="text-aqua-600" /> Weekly Sales</h3><div style={{ width: '100%', height: 300 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={SALES_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} /><YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} tick={{fill: '#64748b', fontSize: 12}} /><Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} cursor={{ fill: '#f1f5f9' }} /><Bar dataKey="sales" fill="#0d9488" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"><h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><Users size={20} className="text-solar-600" /> Customer Growth</h3><div style={{ width: '100%', height: 300 }}><ResponsiveContainer width="100%" height="100%"><LineChart data={SALES_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} /><YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} /><Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} /><Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></div></div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="animate-fade-in space-y-8">
            <div className="flex justify-between items-center"><div><h2 className="text-xl font-bold text-slate-900">Inventory Management</h2><p className="text-slate-500">Manage your product catalog, prices, and stock.</p></div><button onClick={handleAddClick} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-aqua-600 transition-colors shadow-lg shadow-slate-200"><Plus size={18} /> Add New Product</button></div>

            {showProductForm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">{isEditing ? <Edit2 size={20} className="text-aqua-600" /> : <Plus size={20} className="text-aqua-600" />}{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                    <button onClick={() => setShowProductForm(false)} className="text-slate-400 hover:text-slate-900 bg-slate-50 p-2 rounded-full transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-6 space-y-6">
                    {!isEditing && (
                      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-20 bg-aqua-500/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10"><div className="flex items-center gap-2 mb-2 text-aqua-400 font-bold text-sm uppercase tracking-wider"><Sparkles size={16} /> AI Assistant</div><p className="text-sm text-slate-300 mb-4">Enter a Name and Category, then let AI write the description.</p><button type="button" onClick={handleGenerateDesc} disabled={isGenerating} className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-2 rounded-lg transition-colors flex items-center gap-2">{isGenerating ? 'Generating...' : 'Generate AI Description'}</button></div>
                      </div>
                    )}
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label><input type="text" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-aqua-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label><select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-aqua-500 outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>{CATEGORIES.filter(c => c !== 'All').map(c => (<option key={c} value={c}>{c}</option>))}</select></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label><input type="number" step="0.01" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-aqua-500 outline-none" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1">Stock</label><input type="number" required className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-aqua-500 outline-none" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} /></div>
                      </div>
                      <div><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea rows={4} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-aqua-500 outline-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                      
                      {/* Image Selection Tabs */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-sm font-medium text-slate-700">Product Image</label>
                             <div className="flex bg-slate-100 rounded-lg p-0.5">
                                <button type="button" onClick={() => setInputType('select')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${inputType === 'select' ? 'bg-white text-aqua-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Select</button>
                                <button type="button" onClick={() => setInputType('file')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${inputType === 'file' ? 'bg-white text-aqua-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Upload</button>
                                <button type="button" onClick={() => setInputType('url')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${inputType === 'url' ? 'bg-white text-aqua-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>URL</button>
                             </div>
                        </div>
                        {inputType === 'select' ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {STOCK_IMAGES.map((img, idx) => (
                                    <div key={idx} onClick={() => setFormData({...formData, image: img.url})} className={`cursor-pointer rounded-xl overflow-hidden border-2 relative group transition-all ${formData.image === img.url ? 'border-aqua-500 ring-2 ring-aqua-200' : 'border-transparent hover:border-slate-200'}`}>
                                        <div className="aspect-square bg-slate-100"><img src={img.url} className="w-full h-full object-cover" alt={img.name} /></div>
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white text-xs font-bold text-center px-1">{img.name}</span></div>
                                        {formData.image === img.url && (<div className="absolute top-1 right-1 bg-aqua-500 text-white rounded-full p-0.5 shadow-md"><CheckCircle size={12} /></div>)}
                                    </div>
                                ))}
                            </div>
                        ) : inputType === 'file' ? (
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={uploadingImage} />
                                {uploadingImage ? (<div className="flex flex-col items-center justify-center py-4"><Loader2 className="animate-spin text-aqua-600 mb-2" size={32} /><span className="text-sm text-slate-500">Resizing & Uploading...</span></div>) : formData.image && formData.image.includes('data:image') ? (<div className="relative group"><img src={formData.image} alt="Preview" className="mx-auto h-48 object-contain rounded-lg shadow-md" /><div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg pointer-events-none"><p className="text-white font-medium flex items-center gap-2"><UploadCloud size={20} /> Click to Change</p></div></div>) : (<div className="py-4"><div className="bg-aqua-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"><UploadCloud className="text-aqua-600" size={32} /></div><p className="text-sm font-bold text-slate-900">Click or Drag to Upload</p><p className="text-xs text-slate-500 mt-1">JPG, PNG (Max 2MB)</p></div>)}
                            </div>
                        ) : (
                            <div className="relative"><input type="text" className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-aqua-500 outline-none text-sm" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg" /><LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />{formData.image && (<div className="mt-2 h-32 bg-slate-50 rounded-lg overflow-hidden border border-slate-100"><img src={formData.image} className="w-full h-full object-contain" alt="URL Preview" onError={(e) => (e.currentTarget.style.display = 'none')} /></div>)}</div>
                        )}
                      </div>

                      <div className="pt-4 flex gap-3">
                        <button type="button" onClick={() => setShowProductForm(false)} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={uploadingImage} className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-aqua-600 transition-colors shadow-lg shadow-slate-200 flex justify-center items-center gap-2 disabled:opacity-50"><Save size={18} /> {isEditing ? 'Save Changes' : 'Create Product'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Product Name</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Category</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Price</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Stock</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productsLoading ? (<tr><td colSpan={5} className="p-8 text-center text-slate-500">Loading inventory...</td></tr>) : products.length === 0 ? (<tr><td colSpan={5} className="p-8 text-center text-slate-500">No products found. Add one to get started.</td></tr>) : (
                    products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={p.image} className="w-10 h-10 rounded-lg bg-slate-100 object-cover border border-slate-200" alt="" /><span className="font-medium text-slate-900">{p.name}</span></div></td>
                        <td className="px-6 py-4 text-slate-600"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{p.category}</span></td>
                        <td className="px-6 py-4 text-slate-700 font-medium">${p.price}</td>
                        <td className="px-6 py-4"><div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div><span className={`text-sm ${p.stock > 10 ? 'text-green-700' : 'text-red-700'}`}>{p.stock} units</span></div></td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={(e) => handleEditClick(e, p)} className="relative z-50 text-slate-400 hover:text-blue-600 mr-3 p-1 hover:bg-blue-50 rounded transition-colors" type="button"><Edit2 size={16} /></button>
                          <button 
                            onClick={(e) => handleDeleteClick(e, p.id)} 
                            disabled={deletingId === p.id}
                            className={`relative z-50 text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors ${deletingId === p.id ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            type="button"
                          >
                             {deletingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash size={16} />}
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
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden overflow-x-auto animate-fade-in"><table className="w-full text-left min-w-[800px]"><thead className="bg-slate-50/50 border-b border-slate-200"><tr><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Order ID</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Customer</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th><th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Total</th></tr></thead><tbody className="divide-y divide-slate-100">{MOCK_ORDERS.map(order => (<tr key={order.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 font-mono text-sm text-slate-600">#{order.id}</td><td className="px-6 py-4 text-slate-900 font-medium"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">{order.customerName.charAt(0)}</div>{order.customerName}</div></td><td className="px-6 py-4 text-slate-500 text-sm">{order.date}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold border ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{order.status}</span></td><td className="px-6 py-4 text-right font-bold text-slate-900">${order.total}</td></tr>))}</tbody></table></div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;