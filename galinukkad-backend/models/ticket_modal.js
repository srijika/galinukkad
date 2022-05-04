const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    loginid: { type: Schema.ObjectId, ref: "UserLogins", required: true },
    priority: { type: String, default: '' }, // Normal low high
    status: { type: Number, default: 1 }, // 1-active 0-inactive 2-pendin
},
{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
}
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Tiicket', schema);