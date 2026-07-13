const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ success: false, error: 'Profile not found.' });

        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.put('/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.address = req.body.address || user.address;

        const updatedUser = await user.save();
        updatedUser.password = undefined;

        res.json({ success: true, message: 'Profile updated successfully.', data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.get('/', requireAuth, requireAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ success: false, error: 'Cannot delete your own admin account.' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        await user.deleteOne();
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

module.exports = router;
