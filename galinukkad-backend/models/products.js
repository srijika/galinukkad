const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DimensionsSchema = new Schema({
    length: { type: String },
    width: { type: String },
    height: { type: String },
});

const AttributesSchema = new Schema({
    name: { type: String },
    value: { type: String },
});

const varientsSchema = new Schema({
    label: { type: String },
    value: { type: String },
});

const schema = new Schema({
    title: { type: String, required: true, trim: true },
    brand: { type: String,  },
    is_manage_stock: { type: Boolean, default: false },
    
    is_sale: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    vendor: { type: String, required: true },
    reviewcount: { type: Number, default: 0 },
    is_out_of_stock: { type: Boolean, default: false },
    updated: { type: Date, required: true, default: new Date() },
    depot: { type: Number, default: 0 },
    inventory: { type: Number, default: 0 },
    product_status: { type: String, default: 1 }, // 1 is  Active, 0 is Inactive
    variants: [varientsSchema],

    productFeatures: { type: Array, default: [] },
    category: { type: Schema.ObjectId, ref: 'Category' },
    subCategory: { type: Schema.ObjectId, ref: 'sub_category' },
    // thumbnail: { type: Array },
    loginid: { type: Schema.ObjectId, ref: 'UserLogins' },
    description: { type: String, default: '' },
    specs: { type: String, default: '' },
    color: [{ type: String, default: '' }],
    location: [{ type: String, default: '' }],
    keywords: [{ type: String, default: '' }],
    rewardpoint: { type: Number, default: 0 },
    productId: { type: String, default: '' },
    height: { type: Number, default: 0 },
    depth: { type: Number, default: 0 },
    width: { type: Number, default: 0 },

    // new fields add 14-12-2020

    // General fileld 
    price: { type: Number, require: true },
    mrp_price: { type: Number, default: 0 },
    discount_percent: { type: Number, default: 0 },
    
    sale_price: { type: Number, default: 0 },
    // discounted_price: { type: Number },
    
    // sale_price_date_from: { type: Date },
    // sale_price_date_to: { type: Date },

    // Inventory fields
    sku: { type: String, require: true, unique: true },
    // stock_quanlity: { type: Number, require: true },
    allow_back_orders: { type: String, default: null },
    low_stock_threshold: { type: String, default: null },
    stock_status: { type: String, default: "In Stock" },

    // Shipping
    weight: { type: String },
    dimensions: DimensionsSchema,
    attributes: [AttributesSchema],

    // Product Images
    images: { type: Object },
    video: { type: Object },
    gallary_images: { type: Array },

    // Premium Package
    top_sale: { type: Number , default: 0 } ,
    top_trending: { type: Number , default: 0}

}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.index({ title: 'text', keywords: 'text', keywords: 'text', vendor: 'text', description: 'text' });

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('product', schema);
