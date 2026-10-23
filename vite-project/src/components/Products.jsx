import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Sparkles, Check, Heart, Store } from 'lucide-react';
import { productAPI } from '../services/api';
import { productsData as fallbackData } from '../data/productsData';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Products({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll();
      if (res.success && res.products && res.products.length > 0) {
        setProducts(res.products);
      } else {
        setProducts(fallbackData);
      }
    } catch (err) {
      console.warn('Backend products fetch failed, using fallback:', err.message);
      setProducts(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Ground Spices', 'Whole Spices', 'Blended Spices'];

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (item.category && item.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            100% Stone-Ground Heritage
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white">Our Spice Collection</h3>
          <p className="text-sm text-gray-400 mt-1">
            Hygienically packed with maximum natural essential oils, vibrant color, and pure aroma.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search spices..."
            className="w-full bg-[#12151c] border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-900/50 rounded-2xl p-5 border border-gray-800 animate-pulse space-y-4">
              <div className="w-full h-48 bg-gray-800 rounded-xl" />
              <div className="h-4 bg-gray-800 rounded w-1/3" />
              <div className="h-6 bg-gray-800 rounded w-2/3" />
              <div className="h-16 bg-gray-800 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-gray-900/40 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-sm">No spices found matching your search.</p>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((item) => {
            const price = item.price || 99;
            const originalPrice = item.originalPrice || Math.round(price * 1.25);
            const inWishlist = isInWishlist(item._id || item.slug || item.id);

            return (
              <div
                key={item._id || item.id || item.slug}
                className={`bg-gradient-to-br ${item.bgColor || 'from-amber-500/20 to-amber-700/10'} border ${
                  item.borderColor || 'border-amber-500/40'
                } rounded-2xl p-5 transition duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-xl relative group`}
              >
                <div>
                  {/* Product Image */}
                  <div className="w-full h-48 overflow-hidden rounded-xl mb-4 border border-white/10 relative bg-black/40">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Wishlist Heart Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item);
                      }}
                      className={`absolute top-2.5 left-2.5 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                        inWishlist
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
                          : 'bg-black/60 text-gray-300 hover:text-rose-400 hover:bg-black/80'
                      }`}
                      title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-amber-300 font-bold">
                      ★ {item.rating || 4.9}
                    </div>

                    {/* Out of Stock Ribbon */}
                    {item.inStock === false && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Header tags & Price */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        item.textColor || 'text-amber-400'
                      } bg-black/40 px-3 py-1 rounded-full border border-white/10`}
                    >
                      {item.weight || '100g Pack'}
                    </span>

                    {/* Price Tag */}
                    <div className="text-right">
                      <span className="text-base font-extrabold text-white">₹{price}</span>
                      {originalPrice > price && (
                        <span className="text-[11px] text-gray-500 line-through ml-1.5">
                          ₹{originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold text-white mb-1">{item.name}</h4>
                  <p className={`text-xs font-semibold ${item.textColor || 'text-amber-400'} mb-1.5`}>
                    {item.subTitle}
                  </p>

                  {/* Seller attribution */}
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-2.5">
                    <Store className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>Seller: <strong className="text-gray-300">{item.sellerName || 'Pisawat Spices'}</strong></span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Highlights */}
                  {item.whyChoose && item.whyChoose.length > 0 && (
                    <div className="space-y-1.5 mb-5">
                      {item.whyChoose.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 mr-2 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <button
                    disabled={item.inStock === false}
                    onClick={() => addToCart(item, 1)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-black text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{item.inStock === false ? 'Out of Stock' : `Add to Cart (₹${price})`}</span>
                  </button>

                  <button
                    onClick={() => onSelectProduct(item)}
                    className="w-full bg-gray-900/80 hover:bg-black text-white text-xs font-medium py-2 rounded-xl border border-white/10 transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>View Packaging & Nutrition</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
