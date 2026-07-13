const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.post('/', async (req, res) => {
    try {
        const { items, shipping, total } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, error: 'Order must contain at least one item.' });
        }

        if (!shipping || !shipping.name || !shipping.address) {
            return res.status(400).json({ success: false, error: 'Shipping details are required.' });
        }

        const orderId = 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
        const orderTotal = total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const orderItems = items.map(item => ({
            product_id: item.product_id || item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image || ''
        }));

        const newOrder = await Order.create({
            order_id: orderId,
            user_id: req.user._id,
            user_email: req.user.email,
            items: orderItems,
            shipping_details: shipping,
            total: orderTotal,
            status: 'confirmed'
        });

        await Cart.deleteMany({ user_id: req.user._id });

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            data: {
                orderId: newOrder.order_id,
                total: newOrder.total,
                status: newOrder.status,
                date: newOrder.createdAt
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({ user_id: req.user._id }).sort({ createdAt: -1 });

        const mappedOrders = orders.map(order => ({
            ...order._doc,
            id: order._id,
            order_items: order.items // Map Mongoose format back to expected response
        }));

        res.json({ success: true, count: mappedOrders.length, data: mappedOrders });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.get('/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ order_id: orderId, user_id: req.user._id });

        if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });

        const formattedOrder = {
            ...order._doc,
            id: order._id,
            order_items: order.items
        };

        res.json({ success: true, data: formattedOrder });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

module.exports = router;
