const expectedToken = '9FRk6D9DYS2mgM2HtDVRJwNRca1KQfVT';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header provided' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== expectedToken) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  next();
};

module.exports = authMiddleware;
