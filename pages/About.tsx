import React from 'react';
import { Droplets, Sun, ShieldCheck, Users, Globe, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden font-sans pt-24 pb-20">
      
      {/* Clear Background Image (No heavy color mixing) */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2560&auto=format&fit=crop" 
          alt="Clean Water Background" 
          className="w-full h-full object-cover"
        />
        {/* Minimal Overlay for Text Contrast Only */}
        <div className="absolute inset-0 bg-white/40 dark:bg-black/60 transition-colors duration-300"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md border border-white/40 dark:border-white/10 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-widest mb-6 shadow-sm">
            <Globe size={14} className="text-cyan-600" /> Since 2024
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-6 leading-tight drop-shadow-md">
            Pioneering a <span className="text-cyan-700 dark:text-cyan-400">Sustainable Future</span>
          </h1>
          <p className="text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-semibold bg-white/30 dark:bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            Aquacare Enterprises is at the forefront of the eco-revolution. We combine advanced water purification technology with high-efficiency solar power to create a cleaner, greener world for generations to come.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 animate-fade-in">
            {[
                { label: 'Happy Customers', value: '10,000+', icon: Users, color: 'text-cyan-600', bg: 'bg-white/90' },
                { label: 'Liters Purified', value: '5M+', icon: Droplets, color: 'text-blue-600', bg: 'bg-white/90' },
                { label: 'Energy Saved', value: '250MW', icon: Sun, color: 'text-amber-500', bg: 'bg-white/90' },
            ].map((stat, idx) => (
                <div key={idx} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-700 p-8 rounded-3xl shadow-xl flex items-center gap-6 hover:-translate-y-1 transition-transform duration-300">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-sm`}>
                        <stat.icon size={32} />
                    </div>
                    <div>
                        <div className="text-3xl font-display font-bold text-slate-900 dark:text-white">{stat.value}</div>
                        <div className="text-slate-600 dark:text-slate-400 font-bold">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] p-10 text-slate-900 dark:text-white shadow-2xl border border-white/50 dark:border-slate-700 relative overflow-hidden group">
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700">
                        <Award className="text-cyan-600" size={24} />
                    </div>
                    <h3 className="text-3xl font-display font-bold mb-4">Our Mission</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">
                        To democratize access to clean water and renewable energy through innovative, affordable, and durable technology. We strive to reduce the global carbon footprint while enhancing the quality of life for every household we touch.
                    </p>
                </div>
            </div>

            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/50 dark:border-slate-700 rounded-[2.5rem] p-10 shadow-2xl">
                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl flex items-center justify-center mb-6 border border-cyan-100 dark:border-cyan-800">
                    <ShieldCheck className="text-cyan-600 dark:text-cyan-400" size={24} />
                </div>
                <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">Why Choose Us?</h3>
                <ul className="space-y-4">
                    {[
                        "Industry-leading RO & UV filtration technology.",
                        "High-efficiency monocrystalline solar panels.",
                        "24/7 Dedicated support and maintenance teams.",
                        "5-Year comprehensive warranty on all products.",
                        "Eco-friendly manufacturing processes."
                    ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300 font-bold">
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold">✓</span>
                            </div>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-12 md:p-20 relative overflow-hidden shadow-2xl border border-white/50 dark:border-slate-700">
            <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white mb-6">Ready to Upgrade Your Lifestyle?</h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg mb-8 max-w-2xl mx-auto font-medium">Join thousands of satisfied customers who have switched to smarter, cleaner, and more efficient living with Aquacare.</p>
                <button className="bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-700 transition-colors shadow-lg hover:shadow-cyan-500/25 transform hover:-translate-y-1">
                    Explore Products
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;