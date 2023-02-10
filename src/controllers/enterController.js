const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateTokenJwt = require('../utils/jwt');
const nodemailer = require('../utils/nodemailer');
const speakeasy = require('speakeasy');
const Validation = require('./validation/enter');

async function register(req, res) {
  const { error } = Validation.register(req.body);
  if (error)
    return res.status(400).send({ success: false, error: error.message });

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
  const { error } = Validation.login(req.body);
  if (error)
    return res.status(400).send({ success: false, error: error.message });

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
    const token = generateTokenJwt(checkUser);

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
  const { error } = Validation.lostPassword(req.body);
  if (error)
    return res.status(400).send({ success: false, error: error.message });

  try {
    const checkUser = await User.findOne({ email: req.body.email });
    if (!checkUser)
      return res
        .status(400)
        .send({ success: false, error: 'Esse email não está cadastrado!' });

    const secret = speakeasy.generateSecret({ length: 20 });

    // Save SecretKey in User
    await User.updateOne(
      { email: req.body.email },
      { secretKey: secret.base32 }
    );

    //Create Token
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
      step: 600, // 10min duração
      window: 0,
    });

    // console.log(token);

    const urlAcess = `${process.env.URL_CLIENTSIDE}/recovery/${checkUser._id}`;

    const emailMessage = `<h2>Instruções para gerar uma nova senha.</h2><p>Acesse o link abaixo e digite o token.</p><a href="${urlAcess}">${urlAcess}</a><h2>Token: ${token}</h2>`;

    const sendEmail = await nodemailer(
      emailMessage,
      'Recuperação de Senha',
      req.body.email
    );

    if (sendEmail.accepted.length === 0)
      return res.status(400).send({
        sucess: false,
        message: 'Não foi possível enviar o email para recuperar a senha.',
      });

    return res.status(200).send({
      sucess: true,
      message: 'Email para recuperar a senha foi enviado.',
    });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function checkSecret(req, res) {
  try {
    const user = await User.findOne({ _id: req.params.idUser });

    if (user.secretKey) return res.status(200).send({ secretKey: true });
    else return res.status(200).send({ secretKey: false });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function validateToken(req, res, next) {
  const { error } = Validation.validateToken(req.body);
  if (error)
    return res.status(400).send({ success: false, error: error.message });

  try {
    const path = req.route.path;
    const { id, token } = req.body;
    const user = await User.findOne({ _id: id });

    if (!user.secretKey)
      return res.status(401).send({
        success: false,
        message: 'Esse usuário não pediu para recuperar a senha.',
      });

    const validate = speakeasy.totp.verify({
      secret: user.secretKey,
      encoding: 'base32',
      token: token,
      step: 600,
      window: 0,
    });

    if (!validate)
      return res.status(401).send({
        success: false,
        message: 'Token inválido!',
      });

    if (path === '/validateToken') res.status(200).send({ success: true });
    next();
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

async function newPassword(req, res) {
  const { error } = Validation.newPassword(req.body);
  if (error)
    return res.status(400).send({ success: false, error: error.message });

  try {
    if (!req.body.password)
      return res
        .status(400)
        .send({ success: false, message: 'Não foi passada uma nova senha!' });

    const newPass = bcrypt.hashSync(req.body.password);

    const editedUser = await User.findByIdAndUpdate(
      req.body.id,
      {
        password: newPass,
        secretKey: '',
        profileEditedAt: Date.now(),
      },
      { new: true }
    );

    return res
      .status(200)
      .send({ success: true, message: 'Senha alterada!', user: editedUser });
  } catch (error) {
    res.status(400).send({ success: false, error: error });
  }
}

module.exports = {
  register,
  login,
  lostPassword,
  checkSecret,
  validateToken,
  newPassword,
};
