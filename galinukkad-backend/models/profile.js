const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: null, trim: true },
    loginid: { type: Schema.ObjectId, required: true },
    name: { type: String, default: null, trim: true },
    gender: { type: String, default: null },
    dob: { type: Date, default: new Date() },

    photo: { type: String, default: null, trim: true },


    add1: { type: String, },
    add2: { type: String, },
    postal: { type: String, },
    city: { type: String, },
    state: { type: String, },

}, {
    timestamps: { createdAt: "create", updatedAt: "updated" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('profile', schema);
