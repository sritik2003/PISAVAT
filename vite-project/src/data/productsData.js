import haldiImg from '../assets/haldi.jpeg';

export const productsData = [
  {
    id: 'turmeric',
    name: 'Turmeric (Haldi) Powder',
    subTitle: 'High Curcumin (7-12%) • Pure Indian Spice',
    image: haldiImg, // <--- Imported image variable
    bgColor: 'from-amber-500/20 to-amber-700/10',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    description: 'Sourced from the Lakadong region of Meghalaya. Naturally sun-dried and stone-ground to lock in maximum curcumin and purity.',
    whyChoose: ['7-12% High Curcumin', '100% Pure & Natural', 'No Added Chemicals', 'Rich Aroma & Vibrant Color'],
    nutrition: { energy: '312 kcal', protein: '7.13 g', carbs: '67.0 g', fat: '3.12 g', fibre: '21.0 g', sodium: '38.0 mg' },
    ingredients: '100% Turmeric Powder'
  },
  {
    id: 'red-chilli',
    name: 'Red Chilli Powder',
    subTitle: 'Rich Color & Spicy Heat',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    bgColor: 'from-red-600/20 to-red-800/10',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-400',
    description: 'Sun-dried to perfection and hygienically ground to deliver intense heat, vibrant red color, and bold flavor.',
    whyChoose: ['Vibrant Red Color', 'Natural Goodness', 'No Added Chemicals', 'Rich Aroma & Bold Flavor'],
    nutrition: { energy: '429 kcal', protein: '12.0 g', carbs: '54.0 g', fat: '14.0 g', fibre: '34.0 g', sodium: '36.0 mg' },
    ingredients: '100% Red Chilli Powder'
  },
  {
    id: 'coriander',
    name: 'Coriander (Dhaniya) Powder',
    subTitle: 'Aromatic & Flavorful',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
    bgColor: 'from-emerald-600/20 to-emerald-800/10',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    description: 'Carefully selected coriander seeds stone-ground to preserve their natural oils, rich taste, and fresh aroma.',
    whyChoose: ['Fresh & Aromatic', 'Natural Goodness', 'No Added Chemicals', 'Rich in Taste'],
    nutrition: { energy: '278 kcal', protein: '12.0 g', carbs: '42.0 g', fat: '12.0 g', fibre: '21.0 g', sodium: '31.0 mg' },
    ingredients: '100% Coriander Powder'
  },
  {
    id: 'cumin',
    name: 'Cumin (Jeera) Seeds',
    subTitle: 'Naturally Aromatic & Pure',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    bgColor: 'from-yellow-700/20 to-amber-900/10',
    borderColor: 'border-yellow-600/40',
    textColor: 'text-yellow-500',
    description: 'Handpicked and cleaned seeds sun-dried to retain natural essential oils and deliver authentic flavor.',
    whyChoose: ['Naturally Aromatic', 'Pure & Natural', 'No Added Chemicals', 'Rich in Flavor'],
    nutrition: { energy: '375 kcal', protein: '17.8 g', carbs: '44.2 g', fat: '22.0 g', fibre: '17.3 g', sodium: '168 mg' },
    ingredients: '100% Cumin Seeds'
  },
  {
    id: 'garam-masala',
    name: 'Premium Garam Masala',
    subTitle: 'Authentic Traditional Blend',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    bgColor: 'from-amber-900/30 to-stone-900/20',
    borderColor: 'border-amber-700/40',
    textColor: 'text-amber-500',
    description: 'A special blend of premium whole spices crafted to add rich warmth, aroma, and depth to every dish.',
    whyChoose: ['Authentic Blend', 'Pure & Natural', 'No Added Chemicals', 'Rich Aroma & Flavor'],
    nutrition: { energy: '308 kcal', protein: '14.0 g', carbs: '40.0 g', fat: '12.0 g', fibre: '22.0 g', sodium: '78 mg' },
    ingredients: 'Coriander, Cumin, Black Pepper, Cardamom, Clove, Cinnamon, Star Anise, Bay Leaf, Dry Ginger'
  }
];