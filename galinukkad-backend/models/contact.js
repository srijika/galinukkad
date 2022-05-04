const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name:{ type: String, default: '' },
    email: { type: String, default: '' },
    subject: { type: String,default: '' },
    message: { type: String, default:'' },
  
}, {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Contact', schema);