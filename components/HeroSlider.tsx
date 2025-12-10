import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: "Aquacare Enterprises",
    subtitle: "Complete Water Purification & Solar Solutions. Delivering purity and energy for a sustainable future.",
    // Abstract water image for main slide
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2069&auto=format&fit=crop", 
    color: "from-cyan-950",
    accent: "text-aqua-400",
    button: "bg-aqua-500 hover:bg-aqua-600",
    link: "/about" // Redirect to About Us
  },
  {
    id: 2,
    title: "SS Water Coolers",
    subtitle: "Premium stainless steel water coolers for schools, offices, and industries. Cold water on demand.",
    // Realistic Stainless Steel Water Cooler Image
    image: "https://cpimg.tistatic.com/05466436/b/4/Stainless-Steel-Water-Cooler.jpg", 
    color: "from-blue-950",
    accent: "text-blue-300",
    button: "bg-blue-600 hover:bg-blue-700",
    link: "/about" // Redirect to About Us
  },
  {
    id: 3,
    title: "Solar Energy Panels",
    subtitle: "Harness the power of the sun. High-efficiency PV cells for your home and business.",
    // High-res Solar Panel installation
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop",
    color: "from-amber-950",
    accent: "text-solar-500",
    button: "bg-solar-600 hover:bg-solar-700",
    link: "/about" // Redirect to About Us
  },
  {
    id: 4,
    title: "Filter Components",
    subtitle: "High-quality cartridges, membranes, and pumps for all types of RO systems.",
    // Industrial components/gauges/piping close-up
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop",
    color: "from-slate-900",
    accent: "text-slate-300",
    button: "bg-slate-600 hover:bg-slate-700",
    link: "/about" // Redirect to About Us
  },
  {
    id: 5,
    title: "Industrial RO Plants",
    subtitle: "1000 LPH+ Large-scale water treatment solutions for factories and commercial complexes.",
    // Reliable High-Quality Image of Industrial Plant Piping/Machinery (Matches RO Plant Aesthetic)
    image: "https://images.unsplash.com/photo-1615811361269-669243c72b2c?q=80&w=2070&auto=format&fit=crop",
    color: "from-emerald-950",
    accent: "text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-700",
    link: "/about" // Redirect to About Us
  }
];

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000); 

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-slate-900 font-sans">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image with Darker Overlay */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className={`absolute inset-0 bg-gradient-to-t ${slide.color} via-transparent to-transparent opacity-90 z-10`} />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} via-transparent to-transparent opacity-80 z-10`} />
          
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover transform transition-transform duration-[8000ms] ease-out ${
              index === current ? 'scale-110' : 'scale-100'
            }`}
            onError={(e) => {
              // Fallback to a stable industrial image if primary fails
              e.currentTarget.src = "https://images.unsplash.com/photo-1581093458791-9f302e68383e?q=80&w=2070";
            }}
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center pb-20 md:pb-0">
              <div className="max-w-3xl animate-slide-up mt-10 md:mt-0">
                <div className={`inline-block px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-xs md:text-sm font-semibold tracking-wide mb-4 md:mb-6 ${index === current ? 'animate-fade-in' : ''}`}>
                   Aquacare Collection • 0{slide.id}
                </div>
                
                {/* Mobile Friendly Typography */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white tracking-tight mb-4 md:mb-6 leading-tight drop-shadow-lg">
                  {slide.title.split(' ').map((word, i) => (
                    <span key={i} className={i === 0 ? slide.accent : 'text-white'}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                
                <p className="text-lg md:text-xl text-slate-100 mb-8 md:mb-10 max-w-xl leading-relaxed drop-shadow-md font-medium text-opacity-90">
                  {slide.subtitle}
                </p>
                
                {/* CTA Button */}
                <div className="flex gap-4">
                  <Link
                    to={slide.link}
                    className={`${slide.button} text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-xl shadow-black/20 text-sm md:text-base z-30`}
                  >
                    Explore Now <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-20 md:bottom-12 left-0 right-0 z-30 flex justify-center gap-2 md:gap-3">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 backdrop-blur-sm shadow-sm ${
              idx === current ? 'w-6 md:w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hidden md:block hover:scale-110 border border-white/10"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hidden md:block hover:scale-110 border border-white/10"
      >
        <ChevronRight size={32} />
      </button>
    </section>
  );
};

export default HeroSlider;