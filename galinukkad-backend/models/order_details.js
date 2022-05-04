const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    product_id: { type: Schema.ObjectId, ref: 'product' },
    seller_id: { type: Schema.ObjectId, ref: 'UserLogins' },
    order_number: { type: Schema.ObjectId, ref: 'order' },
    category_id: { type: Schema.ObjectId, ref: 'category' },
    amount: { type: Number, required: true },
    shippingCharges: {type: Number},
    returnShippingCharges: {type: Number},
    
    item_tracking_id: {type: Number},
    

    product_weight: { type: Number },
    quantity: { type: Number },
    seller_pincode: { type: Number },
    ecom_shipping_price: {type: Object},
    galinukkad_shipping_price: {type: Object},

    // UNCOMMENT BECAUSE PARTICULAR ORDER ITEM STATUS CHECK 
    item_status: { type: Number, default: 0 }, // 0 for order placed, 1 for order delivered, 2 for order cancelled, 3 for order returned, 4 for order refund
    cancel_desc: { type: String },
    return_desc: { type: String },
    refund_desc: { type: String },
    track_status: { type: String, default: 'Ordered' }, // Ordered , Shipped , Out_For_Delivery , Delivered , Cancelled 


    delivered_date: { type: Date },
    expected_delivered_date: { type: Date },
    cancelled_date: { type: Date },
    returned_date: { type: Date },
    return_images: { type: Array },

    refund_date: { type: Date },

    // Track Status Date Update
    shipping_date: { type: Date }, // 
    our_for_delivery_date: { type: Date },
    product_item_delivery_date: { type: Date }, // When Order Delivered to user for track status

    shipping: { type: String, enum: ["Free", "Paid"] }
    
}, {
    timestamps: { createdAt: "create", updatedAt: "updated" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('order_details', schema);
