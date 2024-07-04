const authMiddleware = (req, res, next) => {
    // Check for an authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization header provided' });
    }
  
    // Validate the token
    const token = authHeader.split(' ')[1];
    
    if (token !== 'YOUR_EXPECTED_TOKEN') {
      return res.status(403).json({ message: 'Invalid token' });
    }
  
    // Proceed to the next middleware or route handler
    next();
  };
  
  module.exports = authMiddleware;
  