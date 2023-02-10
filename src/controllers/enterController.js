const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/jwt');
const nodemailer = require('../utils/nodemailer');

async function register(req, res) {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
  });

  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (checkUser) {
      return res
        .status(400)
        .send({ success: false, error: 'Email já cadastrado.' });
    }
    const savedUser = await user.save();
    res.send({ success: true, data: savedUser });
  } catch (error) {
    res.status(400).send(error);
  }
}

async function login(req, res) {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (!checkUser)
      return res
        .status(400)
        .send({ success: false, error: 'Email e/ou senha incorretos.' });

    const passwordAndUserMatch = bcrypt.compareSync(
      req.body.password,
      checkUser.password
    );

    if (!passwordAndUserMatch)
      return res
        .status(400)
        .send({ success: false, error: 'Email e/ou senha incorretos.' });

    //gera o token que é passado via header
    const token = generateToken(checkUser);

    res.header('authorization-token', token);

    const updateUser = await User.findByIdAndUpdate(
      checkUser._id,
      {
        authKey: token,
        lastLoginAt: Date.now(),
      },
      { new: true }
    );

    res.send({
      success: true,
      data: updateUser,
    });
  } catch (error) {}
}

async function lostPassword(req, res) {
  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (!checkUser)
      return res
        .status(400)
        .send({ success: false, error: 'Esse email não está cadastrado!' });

    // await nodemailer(
    //   'Recuperar a senha ok?',
    //   'Recuperação de Senha',
    //   req.body.email
    // );

    return res.status(200).send({ sucess: true, user: checkUser.email });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

module.exports = { register, login, lostPassword };
