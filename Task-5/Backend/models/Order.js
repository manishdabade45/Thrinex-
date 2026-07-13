const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user_email: {
        type: String,
        required: true
    },
    items: [
        {
            product_id: { type: String, required: true },
            product_name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String, default: '' },
        }
    ],
    shipping_details: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: false }
    },
    total: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        enum: ['confirmed', 'processing', 'shipped', 'completed', 'cancelled'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
