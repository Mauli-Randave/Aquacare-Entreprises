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
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Hero Slider */}
      <HeroSlider />

      {/* Features Grid - Overlaps the slider */}
      <section className="py-20 bg-white relative -mt-16 z-20 rounded-t-[2.5rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-aqua-200 hover:bg-aqua-50/50 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 text-aqua-600 shadow-md group-hover:scale-110 transition-transform">
                <Droplet size={32} className="fill-current" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Pure Filtration</h3>
              <p className="text-slate-600 leading-relaxed">Advanced RO & UV technology ensuring every drop is safe, sweet, and mineral-rich.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-solar-200 hover:bg-solar-50/50 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 text-solar-600 shadow-md group-hover:scale-110 transition-transform">
                <Sun size={32} className="fill-current" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Solar Powered</h3>
              <p className="text-slate-600 leading-relaxed">Harness the sun's energy for cooling and power needs. Zero carbon footprint solutions.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 text-purple-600 shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Enterprise Quality</h3>
              <p className="text-slate-600 leading-relaxed">Industrial-grade durability met with elegant home design. Comprehensive 5-year warranty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Featured Collection</h2>
              <p className="text-slate-600 mt-2">Best sellers loved by our eco-conscious community.</p>
            </div>
            <Link to="/shop" className="text-aqua-600 font-bold hover:text-aqua-700 flex items-center gap-2 hover:translate-x-1 transition-transform">
              View All <ArrowRight size={20} />
            </Link>
          </div>
          
          {loading ? (
             <div className="text-center py-12 text-slate-400">Loading products...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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