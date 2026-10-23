import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true
    },
    subTitle: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 99
    },
    originalPrice: {
      type: Number,
      default: 129
    },
    weight: {
      type: String,
      default: '100g Pack'
    },
    category: {
      type: String,
      default: 'Ground Spices'
    },
    inStock: {
      type: Boolean,
      default: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    sellerName: {
      type: String,
      default: 'Pisawat Official'
    },
    bgColor: {
      type: String,
      default: 'from-amber-500/20 to-amber-700/10'
    },
    borderColor: {
      type: String,
      default: 'border-amber-500/40'
    },
    textColor: {
      type: String,
      default: 'text-amber-400'
    },
    description: {
      type: String,
      required: true
    },
    whyChoose: {
      type: [String],
      default: []
    },
    nutrition: {
      energy: { type: String, default: '300 kcal' },
      protein: { type: String, default: '10.0 g' },
      carbs: { type: String, default: '50.0 g' },
      fat: { type: String, default: '5.0 g' },
      fibre: { type: String, default: '20.0 g' },
      sodium: { type: String, default: '40.0 mg' }
    },
    ingredients: {
      type: String,
      default: ''
    },
    fssaiNumber: {
      type: String,
      default: '20826004001943'
    },
    rating: {
      type: Number,
      default: 4.8
    },
    reviewsCount: {
      type: Number,
      default: 24
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
