const jwt = require('jsonwebtoken')
require('dotenv').config()

const { JWT_SECRET_KEY } = process.env;

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.token, JWT_SECRET_KEY);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'User not authenticated'
    })
  }
}
