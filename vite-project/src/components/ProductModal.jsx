import React, { useState } from 'react';
import { ShoppingCart, Check, X, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const price = product.price || 99;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBulkEnquire = () => {
    onClose();
    const enquirySection = document.getElementById('enquiry');
    if (enquirySection) {
      enquirySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#12151c] border border-gray-800 max-w-lg w-full rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="w-full h-48 overflow-hidden rounded-xl mb-4 border border-white/10 relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-amber-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            FSSAI Lic: 20826004001943
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-2xl font-bold text-white">{product.name}</h3>
            <p className={`text-xs font-semibold ${product.textColor || 'text-amber-400'}`}>
              {product.subTitle}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-amber-400">₹{price}</div>
            <div className="text-[10px] text-gray-400">{product.weight || '100g Pack'}</div>
          </div>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed my-3 bg-gray-900/50 p-3 rounded-xl border border-gray-800">
          {product.description}
        </p>

        {/* Nutritional Info */}
        {product.nutrition && (
          <div className="mb-4">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Nutritional Information (per 100g)
            </h4>
            <div className="bg-[#0d0f12] border border-gray-800 rounded-xl p-3 text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-800/80 pb-1">
                <span className="text-gray-400">Energy</span>
                <span className="text-white font-medium">{product.nutrition.energy || '312 kcal'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-1">
                <span className="text-gray-400">Protein</span>
                <span className="text-white font-medium">{product.nutrition.protein || '7.13 g'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-1">
                <span className="text-gray-400">Carbohydrate</span>
                <span className="text-white font-medium">{product.nutrition.carbs || '67.0 g'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-1">
                <span className="text-gray-400">Total Fat</span>
                <span className="text-white font-medium">{product.nutrition.fat || '3.12 g'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-800/80 pb-1">
                <span className="text-gray-400">Dietary Fibre</span>
                <span className="text-white font-medium">{product.nutrition.fibre || '21.0 g'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sodium</span>
                <span className="text-white font-medium">{product.nutrition.sodium || '38.0 mg'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Ingredients */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">Ingredients</h4>
          <p className="text-xs text-gray-400 bg-[#0d0f12] border border-gray-800 p-3 rounded-xl">
            {product.ingredients || '100% Pure Indian Stone-ground Spices with Zero Preservatives'}
          </p>
        </div>

        {/* Quantity and Actions */}
        <div className="pt-2 border-t border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-300">Quantity</span>
            <div className="flex items-center space-x-3 bg-gray-900 border border-gray-800 rounded-xl px-2 py-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs"
              >
                -
              </button>
              <span className="text-xs font-bold text-white px-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 rounded bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              className="py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart (₹{price * quantity})</span>
            </button>

            <button
              onClick={handleBulkEnquire}
              className="py-3 px-4 bg-gray-900 hover:bg-gray-800 text-amber-400 font-semibold rounded-xl transition text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Bulk Enquiry</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
