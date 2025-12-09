
import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Package, Users, DollarSign, Activity, Sparkles, Plus, Edit2, Trash, ShieldAlert, Lock, LogOut, ChevronDown, User, Settings, Droplets, Sun, Filter } from 'lucide-react';
import { MOCK_ORDERS, PRODUCTS } from '../constants';
import { generateProductDescription } from '../services/geminiService';
import { useNavigate, Link } from 'react-router-dom';

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
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  // Dashboard State
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Product AI Generator State
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [generatedDesc, setGeneratedDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Check for existing session
    const auth = sessionStorage.getItem('admin_session');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    
    // Click outside listener for dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsProfileMenuOpen(false);
    navigate('/'); // Redirect to Home
  };

  const handleGenerateDesc = async () => {
    if (!newProductName || !newProductCategory) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(newProductName, newProductCategory);
    setGeneratedDesc(desc);
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
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 outline-none transition-all"
                  placeholder="Enter admin username"
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 outline-none transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-aqua-600 transition-colors shadow-lg shadow-slate-200"
            >
              Access Dashboard
            </button>
          </form>
          
          <div className="mt-8 text-center text-xs text-slate-400">
            Secure connection • Aquacare Enterprises
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col fixed h-full z-10 shadow-2xl">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-10 px-2 group">
             <div className="relative flex-shrink-0">
               <Filter className="h-8 w-8 text-aqua-400 group-hover:text-white transition-colors" />
               <Droplets className="h-4 w-4 text-white absolute bottom-0 right-0 animate-pulse" />
             </div>
             <div>
               <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-wider">
                 AQUACARE
               </h1>
               <span className="text-[10px] uppercase tracking-[0.2em] text-aqua-500 block">Enterprise</span>
             </div>
          </Link>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'overview' ? 'bg-aqua-600/10 text-aqua-400 border border-aqua-600/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Activity size={20} /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'products' ? 'bg-aqua-600/10 text-aqua-400 border border-aqua-600/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Package size={20} /> Products
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${activeTab === 'orders' ? 'bg-aqua-600/10 text-aqua-400 border border-aqua-600/20' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <Users size={20} /> Orders
            </button>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
           <div className="text-xs text-slate-500 mb-2 px-2 uppercase tracking-wide">System</div>
           <div className="flex items-center gap-2 px-2 py-2 text-slate-400 text-sm">
             <div className="w-2 h-2 rounded-full bg-green-500"></div> Online
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        
        {/* Header */}
        <header className="mb-8 flex justify-between items-center">
          <div>
             <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab} Dashboard</h1>
             <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="hidden md:block text-right">
               <div className="text-sm font-bold text-slate-900">System Administrator</div>
               <div className="text-xs text-slate-500">Headquarters</div>
             </div>
             
             {/* Profile Dropdown */}
             <div className="relative" ref={profileMenuRef}>
               <button 
                 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                 className="flex items-center gap-2 hover:bg-slate-100 p-1 pr-2 rounded-full transition-colors focus:outline-none"
               >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-aqua-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-aqua-500/30">
                    SA
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
               </button>

               {isProfileMenuOpen && (
                 <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-50">
                   <div className="p-4 border-b border-slate-50 bg-slate-50">
                     <p className="text-sm font-bold text-slate-900">Signed in as</p>
                     <p className="text-xs text-slate-500 truncate">admin@aquacare.com</p>
                   </div>
                   <div className="p-2">
                     <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors">
                       <User size={16} className="text-slate-400" /> View Profile
                     </button>
                     <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors">
                       <Settings size={16} className="text-slate-400" /> Edit Profile
                     </button>
                   </div>
                   <div className="border-t border-slate-50 p-2">
                     <button 
                       onClick={handleLogout}
                       className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors font-medium"
                     >
                       <LogOut size={16} /> Sign Out
                     </button>
                   </div>
                 </div>
               )}
             </div>
          </div>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: '$45,231.89', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Active Orders', value: '+12', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Customers', value: '2,345', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: 'AI Requests', value: '892', icon: Sparkles, color: 'text-solar-600', bg: 'bg-orange-50' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <DollarSign size={20} className="text-aqua-600" /> Weekly Sales
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} prefix="$" tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                         cursor={{ fill: '#f1f5f9' }}
                      />
                      <Bar dataKey="sales" fill="#0d9488" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                   <Users size={20} className="text-solar-600" /> Customer Growth
                </h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={SALES_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                          contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab with AI Generator */}
        {activeTab === 'products' && (
          <div className="animate-fade-in space-y-8">
            {/* AI Product Generator Tool */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 p-32 bg-aqua-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Sparkles className="text-solar-500" size={20} />
                  </div>
                  <h3 className="text-xl font-bold">AI Product Assistant</h3>
                </div>
                <p className="text-slate-300 mb-6 max-w-xl">
                  Automatically generate SEO-optimized descriptions for your new inventory using Gemini AI.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input 
                    type="text" 
                    placeholder="Product Name (e.g., Solar Pump X1)" 
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-aqua-500 backdrop-blur-sm transition-all"
                    value={newProductName}
                    onChange={e => setNewProductName(e.target.value)}
                  />
                  <select 
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-aqua-500 backdrop-blur-sm [&>option]:text-slate-900"
                    value={newProductCategory}
                    onChange={e => setNewProductCategory(e.target.value)}
                  >
                    <option value="" className="text-slate-900">Select Category</option>
                    <option value="Solar Panels" className="text-slate-900">Solar Panels</option>
                    <option value="Water Filters" className="text-slate-900">Water Filters</option>
                  </select>
                  <button 
                    onClick={handleGenerateDesc}
                    disabled={isGenerating}
                    className="bg-aqua-500 hover:bg-aqua-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-aqua-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-aqua-500/40"
                  >
                    {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Thinking...
                        </>
                    ) : 'Generate Description'}
                  </button>
                </div>

                {generatedDesc && (
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 animate-fade-in backdrop-blur-md">
                    <h4 className="text-xs font-bold text-aqua-400 uppercase tracking-wider mb-3">AI Generated Result:</h4>
                    <p className="text-sm leading-relaxed text-slate-200">{generatedDesc}</p>
                    <div className="mt-4 flex justify-end">
                       <button className="text-xs text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded transition-colors">Copy to Clipboard</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Product Name</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Category</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Price</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Stock</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PRODUCTS.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} className="w-10 h-10 rounded-lg bg-slate-100 object-cover border border-slate-200" alt="" />
                          <span className="font-medium text-slate-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                           {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">${p.price}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-sm ${p.stock > 10 ? 'text-green-700' : 'text-red-700'}`}>
                            {p.stock} units
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-blue-600 mr-3 p-1 hover:bg-blue-50 rounded transition-colors"><Edit2 size={16} /></button>
                        <button className="text-slate-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"><Trash size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Order ID</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Customer</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Date</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_ORDERS.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">#{order.id}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">
                          <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">
                                {order.customerName.charAt(0)}
                             </div>
                             {order.customerName}
                          </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{order.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border 
                          ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                            order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">${order.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
