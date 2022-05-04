const mongoose = require('mongoose');
const validator = require("validator");

// mongoose.Schema.Types.ObjectId
const schema = new mongoose.Schema(
    {
        ticket_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true,
        },
        from: {
            type: String,
            ref: "UserLogins",
            required: true, 
        },
        to: {
            type: String,
            ref: "UserLogins",
            required: true, 
        },
        message: {
            type: String,
            required: true, 
        },
        is_read: {
            type: Boolean ,
            default: false
        },
       
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
);

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TicketQuery', schema);



