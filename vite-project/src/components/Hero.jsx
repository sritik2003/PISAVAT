import React from 'react';

export default function Hero() {
  return (
    <section 
      className="relative overflow-hidden py-20 sm:py-32 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(13, 15, 18, 0.85), rgba(13, 15, 18, 0.95)), url('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=2000&auto=format&fit=crop')`
      }}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <span className="inline-block bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 backdrop-blur-md">
          100% Pure, Natural & Stone-Ground Spices
        </span>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
          Bring Authentic Flavor to <br className="hidden sm:inline"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-red-500">
            Every Kitchen
          </span>
        </h2>
        <p className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
          Crafted with traditional care, zero added chemicals, and rich antioxidant properties. Experience the true heritage of Indian spices with Pisawat.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a 
            href="#products" 
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold px-7 py-3.5 rounded-xl transition shadow-xl shadow-amber-500/20"
          >
            Explore Products
          </a>
          <a 
            href="#promise" 
            className="bg-gray-900/80 hover:bg-gray-800/90 text-gray-200 font-semibold px-7 py-3.5 rounded-xl border border-gray-700/80 backdrop-blur-md transition"
          >
            Quality Standards
          </a>
        </div>
      </div>
    </section>
  );
}