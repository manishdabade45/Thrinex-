const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    product_id: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    quantity: {
        type: Number,
        default: 1,
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Cart', cartSchema);
