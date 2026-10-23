import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Enquiry from '../models/Enquiry.js';
import Coupon from '../models/Coupon.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sampleProducts = [
  {
    slug: 'turmeric',
    name: 'Turmeric (Haldi) Powder',
    subTitle: 'High Curcumin (7-12%) • Pure Indian Spice',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    price: 110,
    originalPrice: 140,
    weight: '100g Pack',
    category: 'Ground Spices',
    inStock: true,
    bgColor: 'from-amber-500/20 to-amber-700/10',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    description: 'Sourced from the Lakadong region of Meghalaya. Naturally sun-dried and stone-ground to lock in maximum curcumin and purity.',
    whyChoose: [
      '7-12% High Curcumin',
      '100% Pure & Natural',
      'No Added Chemicals',
      'Rich Aroma & Vibrant Color'
    ],
    nutrition: {
      energy: '312 kcal',
      protein: '7.13 g',
      carbs: '67.0 g',
      fat: '3.12 g',
      fibre: '21.0 g',
      sodium: '38.0 mg'
    },
    ingredients: '100% Turmeric Powder',
    fssaiNumber: '20826004001943',
    rating: 4.9,
    reviewsCount: 156
  },
  {
    slug: 'red-chilli',
    name: 'Red Chilli Powder',
    subTitle: 'Rich Color & Spicy Heat',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    price: 95,
    originalPrice: 120,
    weight: '100g Pack',
    category: 'Ground Spices',
    inStock: true,
    bgColor: 'from-red-600/20 to-red-800/10',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-400',
    description: 'Sun-dried to perfection and hygienically ground to deliver intense heat, vibrant red color, and bold flavor.',
    whyChoose: [
      'Vibrant Red Color',
      'Natural Goodness',
      'No Added Chemicals',
      'Rich Aroma & Bold Flavor'
    ],
    nutrition: {
      energy: '429 kcal',
      protein: '12.0 g',
      carbs: '54.0 g',
      fat: '14.0 g',
      fibre: '34.0 g',
      sodium: '36.0 mg'
    },
    ingredients: '100% Red Chilli Powder',
    fssaiNumber: '20826004001943',
    rating: 4.8,
    reviewsCount: 132
  },
  {
    slug: 'coriander',
    name: 'Coriander (Dhaniya) Powder',
    subTitle: 'Aromatic & Flavorful',
    image: 'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=600&q=80',
    price: 85,
    originalPrice: 110,
    weight: '100g Pack',
    category: 'Ground Spices',
    inStock: true,
    bgColor: 'from-emerald-600/20 to-emerald-800/10',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    description: 'Carefully selected coriander seeds stone-ground to preserve their natural oils, rich taste, and fresh aroma.',
    whyChoose: [
      'Fresh & Aromatic',
      'Natural Goodness',
      'No Added Chemicals',
      'Rich in Taste'
    ],
    nutrition: {
      energy: '278 kcal',
      protein: '12.0 g',
      carbs: '42.0 g',
      fat: '12.0 g',
      fibre: '21.0 g',
      sodium: '31.0 mg'
    },
    ingredients: '100% Coriander Powder',
    fssaiNumber: '20826004001943',
    rating: 4.9,
    reviewsCount: 98
  },
  {
    slug: 'cumin',
    name: 'Cumin (Jeera) Seeds',
    subTitle: 'Naturally Aromatic & Pure',
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    price: 130,
    originalPrice: 165,
    weight: '100g Pack',
    category: 'Whole Spices',
    inStock: true,
    bgColor: 'from-yellow-700/20 to-amber-900/10',
    borderColor: 'border-yellow-600/40',
    textColor: 'text-yellow-500',
    description: 'Handpicked and cleaned seeds sun-dried to retain natural essential oils and deliver authentic flavor.',
    whyChoose: [
      'Naturally Aromatic',
      'Pure & Natural',
      'No Added Chemicals',
      'Rich in Flavor'
    ],
    nutrition: {
      energy: '375 kcal',
      protein: '17.8 g',
      carbs: '44.2 g',
      fat: '22.0 g',
      fibre: '17.3 g',
      sodium: '168 mg'
    },
    ingredients: '100% Cumin Seeds',
    fssaiNumber: '20826004001943',
    rating: 4.9,
    reviewsCount: 114
  },
  {
    slug: 'garam-masala',
    name: 'Premium Garam Masala',
    subTitle: 'Authentic Traditional Blend',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80',
    price: 150,
    originalPrice: 190,
    weight: '100g Pack',
    category: 'Blended Spices',
    inStock: true,
    bgColor: 'from-amber-900/30 to-stone-900/20',
    borderColor: 'border-amber-700/40',
    textColor: 'text-amber-500',
    description: 'A special blend of premium whole spices crafted to add rich warmth, aroma, and depth to every dish.',
    whyChoose: [
      'Authentic Blend',
      'Pure & Natural',
      'No Added Chemicals',
      'Rich Aroma & Flavor'
    ],
    nutrition: {
      energy: '308 kcal',
      protein: '14.0 g',
      carbs: '40.0 g',
      fat: '12.0 g',
      fibre: '22.0 g',
      sodium: '78 mg'
    },
    ingredients: 'Coriander, Cumin, Black Pepper, Cardamom, Clove, Cinnamon, Star Anise, Bay Leaf, Dry Ginger',
    fssaiNumber: '20826004001943',
    rating: 5.0,
    reviewsCount: 210
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pisawat_spices';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    console.log('🔄 Checking database initial state for 3 Roles & Multi-Vendor Setup...');

    // 1. Seed Admin User
    const adminEmail = 'admin@pisawat.com';
    let adminUser = await User.findOne({ email: adminEmail });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Pisawat Master Admin',
        email: adminEmail,
        password: 'adminPassword123',
        role: 'admin',
        status: 'active',
        phone: '+91 9876543210'
      });
      console.log('👑 Admin user created: admin@pisawat.com / adminPassword123');
    }

    // 2. Seed Seller User
    const sellerEmail = 'seller@pisawat.com';
    let sellerUser = await User.findOne({ email: sellerEmail });
    if (!sellerUser) {
      sellerUser = await User.create({
        name: 'Rohit Sharma (Seller)',
        email: sellerEmail,
        password: 'sellerPassword123',
        role: 'seller',
        status: 'active',
        storeName: 'Royal Pisawat Spices',
        phone: '+91 9822334455',
        address: {
          street: 'Shop 14, Grain & Spice Market',
          city: 'Khari Baoli, Delhi',
          state: 'Delhi',
          pincode: '110006'
        }
      });
      console.log('🏪 Seller user created: seller@pisawat.com / sellerPassword123');
    }

    // 3. Seed Buyer User
    const demoEmail = 'user@pisawat.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Aman Sharma (Buyer)',
        email: demoEmail,
        password: 'password123',
        role: 'buyer',
        status: 'active',
        phone: '+91 9811223344',
        address: {
          street: '145 Gali No 3, Roshan Nagar',
          city: 'Faridabad',
          state: 'Haryana',
          pincode: '121003'
        }
      });
      console.log('🛒 Buyer user created: user@pisawat.com / password123');
    }

    // 4. Seed Products if none exist or ensure seller reference
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const productsWithSeller = sampleProducts.map(p => ({
        ...p,
        seller: sellerUser._id,
        sellerName: 'Royal Pisawat Spices'
      }));
      await Product.insertMany(productsWithSeller);
      console.log(`🌿 Seeded ${sampleProducts.length} Pisawat Spices products with Seller attribution into MongoDB!`);
    } else {
      // Update any products missing seller
      await Product.updateMany(
        { seller: { $exists: false } },
        { $set: { seller: sellerUser._id, sellerName: 'Royal Pisawat Spices' } }
      );
    }

    // 5. Seed Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const sampleCoupons = [
        {
          code: 'SPICE20',
          title: '20% Mega Spice Discount',
          description: 'Get 20% off on authentic stone-ground spices on orders above ₹200',
          discountType: 'percentage',
          discountAmount: 20,
          minOrderAmount: 200,
          maxDiscount: 100,
          isActive: true,
          createdBy: adminUser._id,
          createdByRole: 'admin'
        },
        {
          code: 'FLAT50',
          title: 'Flat ₹50 Festival Savings',
          description: 'Save flat ₹50 on any cart total of ₹250 or more',
          discountType: 'fixed',
          discountAmount: 50,
          minOrderAmount: 250,
          isActive: true,
          createdBy: sellerUser._id,
          createdByRole: 'seller'
        },
        {
          code: 'FIRSTBUY',
          title: 'Welcome First Order',
          description: 'Flat ₹30 off for our first-time buyers',
          discountType: 'fixed',
          discountAmount: 30,
          minOrderAmount: 99,
          isActive: true,
          createdBy: adminUser._id,
          createdByRole: 'admin'
        }
      ];

      await Coupon.insertMany(sampleCoupons);
      console.log('🏷️ Seeded 3 pre-configured discount coupons (SPICE20, FLAT50, FIRSTBUY)!');
    }

    // 6. Sample Enquiry if none exist
    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0) {
      await Enquiry.create({
        name: 'Rajesh Malhotra',
        email: 'rajesh@spicekitchen.in',
        phone: '+91 9988776655',
        companyName: 'Malhotra Caterers',
        productInterest: 'Turmeric & Garam Masala',
        quantity: '50 kg monthly',
        message: 'Interested in bulk stone-ground Lakadong turmeric and authentic Garam Masala supply for our catering business in NCR.'
      });
      console.log('✉️ Sample wholesale enquiry seeded.');
    }

    console.log('✅ Multi-Role (Buyer, Seller, Admin) database initialization completed!');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

// If run directly: `node utils/seedData.js`
if (process.argv[1] && process.argv[1].endsWith('seedData.js')) {
  seedDatabase().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}
