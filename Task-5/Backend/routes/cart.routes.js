const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', async (req, res) => {
    try {
        const cartItems = await Cart.find({ user_id: req.user._id }).sort({ createdAt: 1 });
        
        const items = cartItems.map(item => ({
            ...item._doc,
            id: item._id
        }));

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        res.json({
            success: true,
            data: { items, totalItems, totalPrice }
        });
    } catch (err) {
        console.error('Cart GET error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { product_id, name, price, image, quantity = 1 } = req.body;

        if (!product_id || !name || (price === undefined || price === null)) {
            return res.status(400).json({ success: false, error: 'product_id, name, and price are required.' });
        }

        let existing = await Cart.findOne({ user_id: req.user._id, product_id });

        if (existing) {
            existing.quantity += quantity;
            await existing.save();
            const data = { ...existing._doc, id: existing._id };
            return res.status(201).json({ success: true, message: `${name} added to cart.`, data });
        } else {
            const newItem = await Cart.create({
                user_id: req.user._id, product_id, name, price, image: image || '', quantity
            });
            const data = { ...newItem._doc, id: newItem._id };
            return res.status(201).json({ success: true, message: `${name} added to cart.`, data });
        }
    } catch (err) {
        console.error('Cart POST error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity < 0) {
            return res.status(400).json({ success: false, error: 'Valid quantity is required.' });
        }

        if (quantity === 0) {
            await Cart.findOneAndDelete({ _id: id, user_id: req.user._id });
            return res.json({ success: true, message: 'Item removed from cart.' });
        }

        const updatedItem = await Cart.findOneAndUpdate(
            { _id: id, user_id: req.user._id },
            { quantity },
            { new: true }
        );

        if (!updatedItem) return res.status(404).json({ success: false, error: 'Item not found in cart' });

        res.json({
            success: true,
            message: 'Cart updated.',
            data: { ...updatedItem._doc, id: updatedItem._id }
        });
    } catch (err) {
        console.error('Cart PUT error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Cart.findOneAndDelete({ _id: id, user_id: req.user._id });
        res.json({ success: true, message: 'Item removed from cart.' });
    } catch (err) {
        console.error('Cart DELETE item error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.delete('/', async (req, res) => {
    try {
        await Cart.deleteMany({ user_id: req.user._id });
        res.json({ success: true, message: 'Cart cleared.' });
    } catch (err) {
        console.error('Cart CLEAR error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

module.exports = router;
