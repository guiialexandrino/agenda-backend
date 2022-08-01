const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function auth(req, res, next) {
  const token = req.header('authorization-token');
  if (!token) return res.status(401).send('Acesso negado.');

  try {
    const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);

    const checkUser = await User.findOne({ _id: userVerified.id });
    if (token !== checkUser.authKey)
      return res
        .status(401)
        .send('Acesso negado: authorization-token inválida.');

    req.user = userVerified;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send('Acesso negado: authorization-token inválida.');
  }
}

module.exports = { auth };
