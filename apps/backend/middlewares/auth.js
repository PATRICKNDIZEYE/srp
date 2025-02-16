import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Log the token for debugging
    console.log('Received token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Add role-based middleware
export const checkFarmerRole = (req, res, next) => {
  if (req.user && req.user.role === 'farmer') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Farmer role required' });
  }
}; 