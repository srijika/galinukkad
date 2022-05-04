const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    for_customer: {type: Boolean}, 
    for_seller: {type: Boolean}, 
    status: {type: String, require: true}, 
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('announcement', schema);
