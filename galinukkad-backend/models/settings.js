const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: {
        type: String, 
    },
    option: {
        type: String, 
        required: true
    },
    value: {
        type: String, 
        required: true
    },
    created_at: {
        type: Date, 
        default: Date.now
    } 

})

schema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('settings', schema);

// module.exports = Setting = mongoose.model('settings', settingSchema);