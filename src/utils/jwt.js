const jwt = require('jsonwebtoken');

function generateToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: 3600 }
  );

  return token;
}

module.exports = generateToken;
