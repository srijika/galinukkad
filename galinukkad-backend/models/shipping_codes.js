const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    pincode: { type: String, required: true },
    area: { type: String },
    region: { type: String },
    reg_code: { type: String },
    city_name: { type: String },    
    dc_routing_code: { type: String },
    dc_code: { type: String },
    state: { type: String },
    service: { type: String },
    Regular_UP_ROS: { type: String },
    exs: { type: String },
    dg: { type: String },
    rvp: { type: String },
    qc_rvp: { type: String },
    egs: { type: String },
    stress_updates: { type: String },
    status: { type: String, default : 1 },
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('shipping_codes', schema);









// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// const schema = new Schema({
//     status: { type: Number, default: 1 },
//     city_type: { type: String },
//     pincode: { type: String, required: true },
//     active: { type: Boolean, default: true },
//     state_code: { type: String },
//     city: { type: String, required: true },
//     dccode: { type: String },
//     route: { type: String },
//     state: { type: String },
//     date_of_discontinuance: { type: String },
//     city_code: { type: String },
//     availability: { type: Boolean, default: true }, // Defines if the shipping is available or not.
// }, {
//     timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
// });

// schema.set('toJSON', { virtuals: true });

// module.exports = mongoose.model('shipping_codes', schema);

// // -> Basic Shipping Rate based on weight, zone, price -> list, create, update, delete

// // 603f847f7280064170ec825c