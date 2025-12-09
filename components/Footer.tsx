import React from 'react';
import { Droplets, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-white">
              <Droplets className="h-6 w-6 text-aqua-500" />
              <span className="text-lg font-bold">Aquacare</span>
            </div>
            <p className="text-sm text-slate-400">
              Pioneering sustainable solutions for water and energy. 
              Join the green revolution today.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-aqua-400 transition-colors">Water Filters</a></li>
              <li><a href="#" className="hover:text-aqua-400 transition-colors">Solar Coolers</a></li>
              <li><a href="#" className="hover:text-aqua-400 transition-colors">Solar Panels</a></li>
              <li><a href="#" className="hover:text-aqua-400 transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-aqua-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-aqua-400 transition-colors">Shipping</a></li>
              <li><a href="#" className="hover:text-aqua-400 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-aqua-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Stay Connected</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Mail size={16} />
              <span>support@aquacare.com</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Aquacare Enterprises. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;