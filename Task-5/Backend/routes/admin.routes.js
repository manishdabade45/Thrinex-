const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.use(requireAuth);
router.use(requireAdmin);

router.get('/stats', async (req, res) => {
    try {
        const totalOrdersCount = await Order.countDocuments();
        
        const orders = await Order.find({});
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

        let totalPlantsSold = 0;
        orders.forEach(order => {
            order.items.forEach(item => { totalPlantsSold += item.quantity });
        });

        const totalCustomers = await User.countDocuments({ role: 'customer' });

        const confirmed = await Order.countDocuments({ status: 'confirmed' });
        const completed = await Order.countDocuments({ status: 'completed' });
        const cancelled = await Order.countDocuments({ status: 'cancelled' });

        res.json({
            success: true,
            data: {
                totalOrders: totalOrdersCount,
                totalSales,
                totalCustomers,
                totalPlantsSold,
                ordersByStatus: { confirmed, completed, cancelled }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const { status, limit = 50, offset = 0 } = req.query;
        let query = {};
        if (status) query.status = status;

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(Number(offset))
            .limit(Number(limit));

        const mappedOrders = orders.map(order => ({
            ...order._doc,
            id: order._id,
            order_items: order.items
        }));

        res.json({ success: true, count: mappedOrders.length, data: mappedOrders });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.put('/orders/:orderId/status', async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['confirmed', 'processing', 'shipped', 'completed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: `Invalid status.` });
        }

        const order = await Order.findOneAndUpdate(
            { order_id: orderId },
            { status },
            { new: true }
        );

        if (!order) return res.status(404).json({ success: false, error: 'Order not found.' });

        res.json({ success: true, message: `Order ${orderId} updated to "${status}".`, data: {
            ...order._doc, id: order._id, order_items: order.items
        } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.delete('/orders/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const result = await Order.findOneAndDelete({ order_id: orderId });

        if (!result) return res.status(404).json({ success: false, error: 'Order not found.' });

        res.json({ success: true, message: `Order ${orderId} deleted.` });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

module.exports = router;
