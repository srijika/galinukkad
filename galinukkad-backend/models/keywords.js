const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    keywords: { type: String, required: true },
  
}
, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('keywords', schema);