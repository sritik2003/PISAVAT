import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productAPI } from '../services/api';

export default function WishlistModal({ isOpen, onClose }) {
  const { wishlist, toggleWishlist } = useAuth();
  const { addToCart, openCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadWishlistProducts();
    }
  }, [isOpen, wishlist]);

  const loadWishlistProducts = async () => {
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }

    setLoading(true);
    try {
      const res = await productAPI.getAll();
      if (res.success && res.products) {
        const favorited = res.products.filter((p) => wishlist.includes(p._id) || wishlist.includes(p.slug));
        setProducts(favorited);
      }
    } catch (err) {
      console.warn('Failed to load wishlist products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12151c] border border-gray-800 max-w-xl w-full rounded-3xl p-5 sm:p-7 relative max-h-[85vh] flex flex-col shadow-2xl my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">My Wishlist ({products.length})</h3>
              <p className="text-xs text-gray-400">Save items you love and move them directly to cart</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              Loading your saved spices...
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-gray-400 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500/40 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-gray-300">Your wishlist is empty</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Click the heart icon on any spice product to save it here for later.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition"
              >
                Browse Products
              </button>
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="flex items-center gap-3 p-3.5 bg-gray-900/70 border border-gray-800 rounded-2xl hover:border-gray-700 transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-800 border border-gray-700 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-sm truncate">{product.name}</h4>
                  <p className="text-xs text-gray-400">{product.weight} • {product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-amber-400 text-sm">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition shadow-lg cursor-pointer"
                    title="Move item to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Move to Cart</span>
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-gray-800 transition cursor-pointer"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {products.length > 0 && (
          <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-xs">
            <span className="text-gray-400">{products.length} items saved</span>
            <button
              onClick={() => {
                onClose();
                openCart();
              }}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
