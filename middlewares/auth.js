const jwt = require('jsonwebtoken');
const secret = 'Pr0Fr@NCH!N$!N6';

const generateToken = (user) => {
  const jwtConfig = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  const token = jwt.sign({ user }, secret, jwtConfig);

  return token;
};

const validateToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    const { user } = jwt.verify(authorization, secret);
    req.user = user;

    next();
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  validateToken,
  generateToken
}