const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

router.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, error: 'Email, password, and name are required.' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        const user = await User.create({ name, email, password, role: 'customer' });

        if (user) {
            const token = generateToken(user._id);
            res.status(201).json({
                success: true,
                message: 'Account created successfully!',
                data: {
                    user: { id: user._id, email: user.email, name: user.name, role: user.role },
                    session: { access_token: token, refresh_token: token, expires_at: Math.floor(Date.now() / 1000) + (30*24*60*60) }
                }
            });
        } else {
            res.status(400).json({ success: false, error: 'Invalid user data' });
        }
    } catch (err) {
        console.error('Signup error:', err.message);
        res.status(500).json({ success: false, error: 'Internal server error during signup.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.json({
                success: true,
                message: 'Login successful!',
                data: {
                    user: { id: user._id, email: user.email, name: user.name, role: user.role },
                    session: { access_token: token, refresh_token: token, expires_at: Math.floor(Date.now() / 1000) + (30*24*60*60) }
                }
            });
        } else {
            res.status(401).json({ success: false, error: 'Invalid email or password.' });
        }
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ success: false, error: 'Internal server error during login.' });
    }
});

router.post('/refresh-token', async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({ success: false, error: 'Refresh token is required.' });
        }
        
        const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid token' });
        }
        
        const newToken = generateToken(user._id);
        res.json({
            success: true,
            data: {
                user: { id: user._id, email: user.email, name: user.name, role: user.role },
                session: { access_token: newToken, refresh_token: newToken, expires_at: Math.floor(Date.now() / 1000) + (30*24*60*60) }
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid or expired refresh token.' });
    }
});

router.post('/logout', requireAuth, (req, res) => {
    res.json({ success: true, message: 'Logged out successfully.' });
});

router.get('/me', requireAuth, async (req, res) => {
    try {
        res.json({
            success: true,
            data: { id: req.user._id, email: req.user.email, name: req.user.name, role: req.user.role, created_at: req.user.createdAt }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

module.exports = router;
