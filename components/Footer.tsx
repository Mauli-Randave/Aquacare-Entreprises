
import React from 'react';
import { Droplets, Facebook, Twitter, Instagram, Mail, ArrowRight, Heart, MapPin, Phone } from 'lucide-react';
import { COMPANY_DETAILS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-slate-950 text-slate-300 overflow-hidden border-t border-slate-900 font-sans">
      {/* Advanced Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Noise Texture for Premium Feel */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
        
        {/* Floating Aurora Blobs */}
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-cyan-900/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[80%] bg-blue-900/20 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }}></div>
        
        {/* Cyber Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-slate-800/50 pb-16">
          
          {/* Brand Column (Span 4) */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3 text-white group cursor-pointer w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900 border border-slate-800 p-2.5 rounded-xl group-hover:border-cyan-500/50 transition-colors duration-300">
                   <Droplets className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                  {COMPANY_DETAILS.name.split(" ")[0]}
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-600 font-bold">Enterprises</span>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-slate-400">
                <p className="flex items-start gap-3">
                    <MapPin size={16} className="mt-1 text-cyan-500 shrink-0" />
                    <span>{COMPANY_DETAILS.address}</span>
                </p>
                <p className="flex items-center gap-3">
                    <Phone size={16} className="text-cyan-500 shrink-0" />
                    <span>{COMPANY_DETAILS.adminPhone}</span>
                </p>
                <p className="flex items-center gap-3">
                    <Mail size={16} className="text-cyan-500 shrink-0" />
                    <span>{COMPANY_DETAILS.adminEmail}</span>
                </p>
            </div>

            <div className="flex items-center gap-4 pt-2">
               {/* Socials with Magnetic Hover Effect */}
               {[
                 { Icon: Facebook, link: "#" },
                 { Icon: Twitter, link: "#" },
                 { Icon: Instagram, link: "https://www.instagram.com/_mauli_randave_/" }
               ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.link} 
                  target={social.link !== "#" ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="group relative p-3 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-900/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <social.Icon size={18} className="relative z-10 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Spacer */}
          <div className="hidden md:block md:col-span-1"></div>

          {/* Links Columns (Span 2) */}
          <div className="md:col-span-2">
            <h3 className="text-white font-display font-bold mb-6 text-sm tracking-wider">SOLUTIONS</h3>
            <ul className="space-y-4 text-sm">
              {['Water Filters', 'Solar Coolers', 'Solar Panels', 'Industrial RO', 'Spare Parts'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-cyan-400 transition-all duration-300 flex items-center gap-2 group w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-cyan-400 transition-colors"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-white font-display font-bold mb-6 text-sm tracking-wider">COMPANY</h3>
            <ul className="space-y-4 text-sm">
              {['About Us', 'Sustainability', 'Careers', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 transition-all duration-300 flex items-center gap-2 group w-fit">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-400 transition-colors"></span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (Span 3) */}
          <div className="md:col-span-3">
            <h3 className="text-white font-display font-bold mb-6 text-sm tracking-wider">STAY UPDATED</h3>
            <p className="text-xs text-slate-500 mb-4">Join our newsletter for the latest eco-tech news.</p>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl opacity-30 group-hover:opacity-75 blur transition duration-500"></div>
              <div className="relative flex bg-slate-950 rounded-xl p-1 border border-slate-800">
                <div className="pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full bg-transparent border-none text-white text-sm focus:ring-0 placeholder:text-slate-600 px-3 py-2 outline-none"
                />
                <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {COMPANY_DETAILS.name}. Crafted with <Heart size={10} className="inline text-red-500 mx-0.5 fill-current" /> for a better planet.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
