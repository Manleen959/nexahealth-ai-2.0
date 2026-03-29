const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    console.log('Protect middleware hit - Headers:', req.headers.authorization ? 'Present' : 'NONE');
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            console.log('Verifying token:', token.substring(0, 10) + '...');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_here');
            console.log('Decoded Token User ID:', decoded.userId);

            // Get user from the token
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ error: 'User not found' });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ error: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token' });
    }
};

module.exports = protect;
