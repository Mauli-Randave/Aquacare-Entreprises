
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sun, Zap, Droplet } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';

const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Dynamic Hero Slider */}
      <HeroSlider />

      {/* Features Grid - Overlaps the slider */}
      <section className="py-24 bg-white dark:bg-slate-900 relative -mt-20 z-20 rounded-t-[3rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-black/60 transition-colors duration-300 border-t border-white/20 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
                { icon: Droplet, title: "Pure Filtration", desc: "Advanced RO & UV technology ensuring every drop is safe, sweet, and mineral-rich.", color: "aqua" },
                { icon: Sun, title: "Solar Powered", desc: "Harness the sun's energy for cooling and power needs. Zero carbon footprint solutions.", color: "solar" },
                { icon: ShieldCheck, title: "Enterprise Quality", desc: "Industrial-grade durability met with elegant home design. Comprehensive 5-year warranty.", color: "purple" }
            ].map((feature, idx) => (
                <div key={idx} className="text-center p-10 rounded-[2rem] bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-800 hover:shadow-xl hover:shadow-cyan-900/5 transition-all duration-300 group">
                    <div className={`w-20 h-20 mx-auto bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-6 text-${feature.color}-500 shadow-lg shadow-slate-200/50 dark:shadow-black/50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                        <feature.icon size={40} className="fill-current opacity-80" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products with Mesh Background */}
      <section className="py-32 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-300/30 dark:bg-cyan-900/30 rounded-full blur-[100px] animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-300/30 dark:bg-blue-900/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-widest text-sm mb-2 block">Premium Selection</span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-900 dark:text-white leading-tight">Featured Collection</h2>
            </div>
            <Link to="/shop" className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold hover:border-cyan-500 dark:hover:border-cyan-500 transition-all shadow-sm hover:shadow-md">
              View All Products <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-cyan-500" />
            </Link>
          </div>
          
          {loading ? (
             <div className="flex justify-center py-20">
                 <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-200 border-t-cyan-600"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
